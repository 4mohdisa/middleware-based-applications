// Import the kleur library for adding color to console output
const kleur = require('kleur');

// Import functions for RabbitMQ connection from the rabbitmq.js utility file
const { connectToRabbitMQ, createChannel } = require('../utils/rabbitmq');

// Import configuration and validation function from the config.js utility file
const { config, validateConfig } = require('../utils/config');

// Import the OrderBook class from the orderBook.js file in the same directory
const OrderBook = require('./orderBook');

// Define the Exchange class to manage the trading exchange
class Exchange {
  // Constructor method to initialize the Exchange
  constructor() {
    // Initialize an empty object to store order books for different stocks
    this.orderBooks = {};
    // Create an order book for each stock defined in the config
    config.stocks.forEach(stock => {
      this.orderBooks[stock] = new OrderBook();
    });
  }

  // Asynchronous method to start the exchange
  async start() {
    // Validate the configuration before starting
    validateConfig();
    // Connect to RabbitMQ
    const connection = await connectToRabbitMQ();
    // Create a channel for communication
    const channel = await createChannel(connection);

    // Set up queues and message listeners
    await this.setupQueuesAndListeners(channel);

    // Log a message indicating the exchange is running
    console.log(kleur.green('Exchange is running...'));
  }

  // Asynchronous method to set up queues and listeners
  async setupQueuesAndListeners(channel) {
    // Assert (create if not exists) the orders queue
    await channel.assertQueue(config.rabbitMQ.ordersTopic, { durable: false });
    // Assert (create if not exists) the trades queue
    await channel.assertQueue(config.rabbitMQ.tradesTopic, { durable: false });

    // Start consuming messages from the orders queue
    channel.consume(config.rabbitMQ.ordersTopic, msg => {
      // Parse the received order message
      const order = JSON.parse(msg.content.toString());
      // Log the received order
      console.log(kleur.blue(`Received order: ${order.username} ${order.side} ${order.stock} at ${order.price}`));
      
      // Process the received order
      this.processOrder(order, channel);
      
      // Acknowledge the message (remove it from the queue)
      channel.ack(msg);
    });
  }

  // Method to process incoming orders
  processOrder(order, channel) {
    // Get the order book for the stock in the order
    const orderBook = this.orderBooks[order.stock];
    // Try to find a matching order in the order book
    const matchingOrder = orderBook.findMatchingOrder(order);

    // If a matching order is found
    if (matchingOrder) {
      // Execute the trade between the two matching orders
      this.executeTrade(order, matchingOrder, channel);
    } else {
      // If no match is found, add the order to the order book
      orderBook.addOrder(order);
      // Log that the order was added to the book
      console.log(kleur.yellow(`No match, order added to book: ${order.username} ${order.side} ${order.stock} at ${order.price}`));
    }
  }

  // Method to execute a trade between two matching orders
  executeTrade(order1, order2, channel) {
    // Determine which order is the buy order and which is the sell order
    const buyOrder = order1.side === 'BUY' ? order1 : order2;
    const sellOrder = order1.side === 'SELL' ? order1 : order2;

    // Create a trade object with the details of the executed trade
    const trade = {
      buyer: buyOrder.username,
      seller: sellOrder.username,
      stock: buyOrder.stock,
      price: sellOrder.price,
      quantity: 100 // Fixed quantity for all trades
    };

    // Publish the trade to the trades queue
    channel.sendToQueue(config.rabbitMQ.tradesTopic, Buffer.from(JSON.stringify(trade)));
    // Log the executed trade
    console.log(kleur.green(`Trade executed: ${trade.buyer} bought ${trade.quantity} ${trade.stock} from ${trade.seller} at ${trade.price}`));

    // Remove the executed order from the order book
    this.orderBooks[trade.stock].removeOrder(order2);
  }
}

// Create an instance of the Exchange class
const exchange = new Exchange();
// Start the exchange and handle any errors that occur
exchange.start().catch(error => {
  // Log any errors that occur when starting the exchange
  console.error(kleur.red('Error starting exchange:'), error);
  // Exit the process with an error code
  process.exit(1);
});
