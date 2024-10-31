// Import the amqplib library, which provides functionality to interact with RabbitMQ
const amqp = require('amqplib');

// Import the kleur library, which is used for coloring console output
const kleur = require('kleur');

// Import the config object from the config.js file in the same directory
const { config } = require('./config');

// Define an asynchronous function to connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    // Attempt to establish a connection to RabbitMQ using the URL from the config
    const connection = await amqp.connect(config.rabbitMQ.url);
    
    // If connection is successful, log a green success message to the console
    console.log(kleur.green('Connected to RabbitMQ'));
    
    // Return the established connection
    return connection;
  } catch (error) {
    // If an error occurs during connection:
    
    // Log an error message to the console in red, including the specific error message
    console.error(kleur.red('Failed to connect to RabbitMQ:'), error.message);
    
    // Exit the process with a status code of 1, indicating an error
    process.exit(1);
  }
}

// Define an asynchronous function to create a channel and assert an exchange
async function createChannel(connection) {
  try {
    // Create a channel on the provided connection
    const channel = await connection.createChannel();
    
    // Assert (create if not exists) an exchange with the name from config
    // Use 'topic' as the exchange type, and set it as non-durable
    await channel.assertExchange(config.rabbitMQ.exchangeName, 'topic', { durable: false });
    
    // If successful, log a green success message to the console
    console.log(kleur.green('Channel and exchange setup complete'));
    
    // Return the created channel
    return channel;
  } catch (error) {
    // If an error occurs during channel creation or exchange assertion:
    
    // Log an error message to the console in red, including the specific error message
    console.error(kleur.red('Failed to create channel:'), error.message);
    
    // Exit the process with a status code of 1, indicating an error
    process.exit(1);
  }
}

// Export the connectToRabbitMQ and createChannel functions so they can be used in other files
module.exports = { connectToRabbitMQ, createChannel };
