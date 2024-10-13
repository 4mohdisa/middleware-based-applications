const kleur = require('kleur');
const { connectToRabbitMQ, createChannel } = require('../utils/rabbitmq');
const { config, validateConfig } = require('../utils/config');
const OrderBook = require('./orderBook');

class Exchange {
  constructor() {
    this.orderBooks = {};
    // Initialize an order book for each stock
    config.stocks.forEach(stock => {
      this.orderBooks[stock] = new OrderBook();
    });
  }

  // Function to start the exchange and consume orders
  async start() {
    validateConfig();
    const connection = await connectToRabbitMQ();
    const channel = await createChannel(connection);

    // Set up RabbitMQ queues and message listeners
    await this.setupQueuesAndListeners(channel);

    console.log(kleur.green('Exchange is running...'));
  }

  // Setup RabbitMQ queues and message listeners for orders and trades
  async setupQueuesAndListeners(channel) {
    await channel.assertQueue(config.rabbitMQ.ordersTopic, { durable: false });
    await channel.assertQueue(config.rabbitMQ.tradesTopic, { durable: false });

    channel.consume(config.rabbitMQ.ordersTopic, msg => {
      const order = JSON.parse(msg.content.toString());
      console.log(kleur.blue(`Received order: ${order.username} ${order.side} ${order.stock} at ${order.price}`));
      
      // Process the order by trying to match it
      this.processOrder(order, channel);
      
      // Acknowledge the message
      channel.ack(msg);
    });
  }

  // Process incoming orders by matching or adding to the order book
  processOrder(order, channel) {
    const orderBook = this.orderBooks[order.stock];
    const matchingOrder = orderBook.findMatchingOrder(order);

    if (matchingOrder) {
      this.executeTrade(order, matchingOrder, channel);
    } else {
      orderBook.addOrder(order);
      console.log(kleur.yellow(`No match, order added to book: ${order.username} ${order.side} ${order.stock} at ${order.price}`));
    }
  }

  // Execute a trade between two matching orders
  executeTrade(order1, order2, channel) {
    const buyOrder = order1.side === 'BUY' ? order1 : order2;
    const sellOrder = order1.side === 'SELL' ? order1 : order2;

    // Create a trade object
    const trade = {
      buyer: buyOrder.username,
      seller: sellOrder.username,
      stock: buyOrder.stock,
      price: sellOrder.price,
      quantity: 100 // Fixed quantity for all trades
    };

    // Publish the trade to the trades queue
    channel.sendToQueue(config.rabbitMQ.tradesTopic, Buffer.from(JSON.stringify(trade)));
    console.log(kleur.green(`Trade executed: ${trade.buyer} bought ${trade.quantity} ${trade.stock} from ${trade.seller} at ${trade.price}`));

    // Remove the executed order from the order book
    this.orderBooks[trade.stock].removeOrder(order2);
  }
}

// Start the exchange
const exchange = new Exchange();
exchange.start().catch(error => {
  console.error(kleur.red('Error starting exchange:'), error);
  process.exit(1);
});
