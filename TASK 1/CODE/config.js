// This file contains configuration settings for the chatting application

// Import the dotenv package and load environment variables from a .env file
require('dotenv').config();

// Define a configuration object to store application settings
const config = {
  // Configuration for RabbitMQ messaging system
  rabbitMQ: {
    // Set the URL for connecting to RabbitMQ
    // Use the value from RABBITMQ_URL environment variable if available,
    // otherwise use the default 'amqp://localhost:5672'
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    
    // Set the name of the RabbitMQ exchange to use
    // Use the value from RABBITMQ_EXCHANGE environment variable if available,
    // otherwise use the default 'chat_room'
    exchange: process.env.RABBITMQ_EXCHANGE || 'chat_room'
  }
};

// Export the config object so it can be imported and used in other parts of the application
module.exports = { config };