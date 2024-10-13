const { connectToRabbitMQ } = require('../utils/rabbitmq');
const { handleApplicationError } = require('../utils/errorHandler');
const kleur = require('kleur');

// In-memory object to store the current positions of all users
let positions = {};

// Start the tracker to listen for position updates
async function startTracker() {
    try {
        const { connection, channel } = await connectToRabbitMQ('amqp://localhost');
        const queue = 'position';

        await channel.assertQueue(queue, { durable: false });

        // Listen for position updates from all users
        channel.consume(queue, (msg) => {
            try {
                const { username, x, y } = JSON.parse(msg.content.toString());
                console.log(kleur.green(`[Tracker] ${username} moved to (${x}, ${y})`));

                // Update the current position of the user
                positions[username] = { x, y };

                // Check if this user has come into contact with any other users
                checkForContacts(username);

                channel.ack(msg); // Acknowledge message processing
            } catch (error) {
                handleApplicationError(`Error processing position update: ${error.message}`, false);  // Log and continue
            }
        });

        console.log(kleur.green('Tracker is running...'));

    } catch (error) {
        handleApplicationError(`Error starting tracker: ${error.message}`);  // Handle application-level errors
    }
}

// Function to check if two people have come into contact
function checkForContacts(movingUser) {
    const { x, y } = positions[movingUser];
    for (const user in positions) {
        if (user !== movingUser && positions[user].x === x && positions[user].y === y) {
            console.log(kleur.yellow(`[Contact] ${movingUser} came into contact with ${user} at (${x}, ${y})`));
        }
    }
}

// Start the tracker
startTracker().catch(error => {
    handleApplicationError(`Error in tracker process: ${error.message}`);  // Catch any errors from async code
});
