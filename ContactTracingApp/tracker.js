// Import the amqplib library to work with RabbitMQ
const amqp = require('amqplib');

// In-memory object to store user positions
let positions = {};

// Function to start the tracker and listen for position updates
async function startTracker() {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    // Create a channel for communication
    const channel = await connection.createChannel();

    // Define the 'position' queue
    const queue = 'position';
    await channel.assertQueue(queue, { durable: false }); // Ensure the queue exists

    // Listen for position updates from users
    channel.consume(queue, (msg) => {
        const { username, x, y } = JSON.parse(msg.content.toString());
        console.log(`[Tracker] ${username} moved to (${x}, ${y})`);

        // Update the user's position
        positions[username] = { x, y };

        // Check for contacts with other users
        checkForContacts(username);

        // Acknowledge that the message has been processed
        channel.ack(msg);
    });

    console.log('Tracker is running...');
}

// Function to check if any users are in the same position
function checkForContacts(movingUser) {
    const { x, y } = positions[movingUser];
    for (const user in positions) {
        // Check if the other user is in the same position
        if (user !== movingUser && positions[user].x === x && positions[user].y === y) {
            console.log(`[Contact] ${movingUser} came into contact with ${user} at (${x}, ${y})`);
        }
    }
}

// Start the tracker
startTracker();
