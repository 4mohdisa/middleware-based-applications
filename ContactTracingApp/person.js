// Import the amqplib library to work with RabbitMQ
const amqp = require('amqplib');

// Function to generate a random position
function getRandomPosition(max) {
    return Math.floor(Math.random() * max);
}

// Function to start the person simulation
async function startPerson(username) {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    // Create a channel for communication
    const channel = await connection.createChannel();

    // Define the 'position' queue
    const queue = 'position';
    await channel.assertQueue(queue, { durable: false }); // Ensure the queue exists

    // Simulate random movements every second
    setInterval(() => {
        const x = getRandomPosition(10); // Random x-coordinate
        const y = getRandomPosition(10); // Random y-coordinate

        // Create a position message
        const position = { username, x, y };
        // Publish the new position to the 'position' queue
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(position)));
        console.log(`[${username}] Moved to (${x}, ${y})`);
    }, 1000); // Move every second
}

// Get the username from command line arguments, or default to 'User'
const username = process.argv[2] || 'User';
// Start the person simulation
startPerson(username);
