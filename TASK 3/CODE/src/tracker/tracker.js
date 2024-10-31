// Import the connectToRabbitMQ function from the rabbitmq.js file in the utils folder
const { connectToRabbitMQ } = require('../utils/rabbitmq');

// Import the handleApplicationError function from the errorHandler.js file in the utils folder
const { handleApplicationError } = require('../utils/errorHandler');

// Import the kleur library for coloring console output
const kleur = require('kleur');

// Create an empty object to store the current positions of all users
// The keys will be usernames, and the values will be objects with x and y coordinates
let positions = {};

// Define an asynchronous function to start the tracker
async function startTracker() {
    try {
        // Connect to RabbitMQ using the connectToRabbitMQ function
        // Destructure the returned object to get the connection and channel
        const { connection, channel } = await connectToRabbitMQ('amqp://localhost');

        // Define the name of the queue we'll be using
        const queue = 'position';

        // Ensure the queue exists, creating it if it doesn't
        // The { durable: false } option means the queue won't survive broker restarts
        await channel.assertQueue(queue, { durable: false });

        // Start consuming messages from the queue
        channel.consume(queue, (msg) => {
            try {
                // Parse the message content from JSON to a JavaScript object
                // The object should contain username, x, and y properties
                const { username, x, y } = JSON.parse(msg.content.toString());

                // Log the user's movement to the console in green
                console.log(kleur.green(`[Tracker] ${username} moved to (${x}, ${y})`));

                // Update the positions object with the user's new position
                positions[username] = { x, y };

                // Check if this user has come into contact with any other users
                checkForContacts(username);

                // Acknowledge that we've processed the message
                // This removes it from the queue
                channel.ack(msg);
            } catch (error) {
                // If there's an error processing the message, log it but continue running
                handleApplicationError(`Error processing position update: ${error.message}`, false);
            }
        });

        // Log that the tracker is running
        console.log(kleur.green('Tracker is running...'));

    } catch (error) {
        // If there's an error starting the tracker, handle it as an application-level error
        handleApplicationError(`Error starting tracker: ${error.message}`);
    }
}

// Define a function to check if a user has come into contact with any other users
function checkForContacts(movingUser) {
    // Get the position of the user who just moved
    const { x, y } = positions[movingUser];

    // Loop through all users in the positions object
    for (const user in positions) {
        // If the current user is not the moving user and their position matches the moving user's position
        if (user !== movingUser && positions[user].x === x && positions[user].y === y) {
            // Log the contact event in yellow
            console.log(kleur.yellow(`[Contact] ${movingUser} came into contact with ${user} at (${x}, ${y})`));
        }
    }
}

// Call the startTracker function to begin tracking
// If there's an error, catch it and handle it as an application-level error
startTracker().catch(error => {
    handleApplicationError(`Error in tracker process: ${error.message}`);
});
