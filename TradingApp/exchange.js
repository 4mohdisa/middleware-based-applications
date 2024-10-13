// Import the amqplib library to work with RabbitMQ
const amqp = require('amqplib');

// In-memory order book to store unmatched orders
let orderBook = [];

// Function to start the exchange and listen for orders
async function startExchange() {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    // Create a channel for communication
    const channel = await connection.createChannel();

    // Define the 'orders' and 'trades' queues
    const ordersQueue = 'orders';
    const tradesQueue = 'trades';
    await channel.assertQueue(ordersQueue, { durable: false }); // Ensure orders queue exists
    await channel.assertQueue(tradesQueue, { durable: false }); // Ensure trades queue exists

    // Listen for incoming orders from the orders queue
    channel.consume(ordersQueue, (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log(`Received order: ${order.username} ${order.side} at ${order.price}`);
        
        // Try to match the order with existing orders
        matchOrder(order, channel, tradesQueue);

        // Acknowledge that the message has been processed
        channel.ack(msg);
    });

    console.log('Exchange is running...');
}

// Function to match orders in the order book
function matchOrder(order, channel, tradesQueue) {
    // Determine the opposite side of the order
    const oppositeSide = order.side === 'BUY' ? 'SELL' : 'BUY';
    // Find a matching order in the order book
    const matchIndex = orderBook.findIndex(o => o.side === oppositeSide && o.price === order.price);

    if (matchIndex !== -1) {
        // Match found! Remove the matched order from the book
        const matchedOrder = orderBook.splice(matchIndex, 1)[0];

        // Create a trade message
        const trade = {
            buyer: order.side === 'BUY' ? order.username : matchedOrder.username,
            seller: order.side === 'SELL' ? order.username : matchedOrder.username,
            price: order.price,
            quantity: 100 // Fixed quantity for this example
        };

        // Publish the trade message to the trades queue
        channel.sendToQueue(tradesQueue, Buffer.from(JSON.stringify(trade)));
        console.log(`Trade executed: ${trade.buyer} bought from ${trade.seller} at ${trade.price}`);
    } else {
        // No match found, add the order to the order book
        orderBook.push(order);
        console.log(`No match, order added to book: ${order.username} ${order.side} at ${order.price}`);
    }
}

// Start the exchange
startExchange();
