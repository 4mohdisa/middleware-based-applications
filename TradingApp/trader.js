// Import the amqplib library to work with RabbitMQ
const amqp = require('amqplib');

// Asynchronous function to send orders to RabbitMQ
async function sendOrder(username, side, price) {
    // Connect to the RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    // Create a channel for communication
    const channel = await connection.createChannel();

    // Define the 'orders' queue
    const queue = 'orders';
    await channel.assertQueue(queue, { durable: false }); // Ensure the queue exists

    // Create an order message
    const order = {
        username: username,
        side: side, // 'BUY' or 'SELL'
        price: price,
        quantity: 100 // Fixed quantity for this example
    };

    // Send the order to the 'orders' queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    console.log(`[${username}] Submitted order: ${side} at price: ${price}`);

    // Close the connection after sending the order
    setTimeout(() => {
        connection.close();
    }, 500);
}

// Get user input from command line arguments
const username = process.argv[2]; // Trader name
const side = process.argv[3];      // 'BUY' or 'SELL'
const price = parseFloat(process.argv[4]); // Order price

// Call the function to send the order
sendOrder(username, side, price);
