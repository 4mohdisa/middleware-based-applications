// Import the amqplib library, which provides functionality to interact with RabbitMQ
const amqp = require('amqplib');

// Import the kleur library, which is used for coloring console output
const kleur = require('kleur');

// Define an asynchronous function named connectToRabbitMQ that takes a URL as a parameter
async function connectToRabbitMQ(url) {
    try {
        // Attempt to establish a connection to RabbitMQ using the provided URL
        const connection = await amqp.connect(url);

        // Create a channel on the established connection
        // Channels are used for communication with RabbitMQ
        const channel = await connection.createChannel();

        // Log a success message to the console in green color
        console.log(kleur.green('Connected to RabbitMQ successfully!'));

        // Return an object containing both the connection and channel
        return { connection, channel };
    } catch (error) {
        // If an error occurs during connection or channel creation:

        // Log an error message to the console in red color
        // The error message includes the specific error message from the caught error
        console.error(kleur.red('Failed to connect to RabbitMQ:'), error.message);

        // Throw a new error with a custom message
        // This will propagate the error to the calling function
        throw new Error('RabbitMQ connection failed.');
    }
}

// Export the connectToRabbitMQ function so it can be used in other files
module.exports = { connectToRabbitMQ };
