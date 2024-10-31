require('dotenv').config();
const kleur = require('kleur');

// Define a configuration object named 'config'
const config = {
  // RabbitMQ configuration settings
  rabbitMQ: {
    // The URL to connect to the RabbitMQ server
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    // The name of the exchange to use for message routing
    exchangeName: 'trading_exchange',
    ordersTopic: 'orders',
    tradesTopic: 'trades'
  },
  
  // An array of valid stock symbols that can be traded
  stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'XYZ'],
  
  // Configuration for the order matching engine
  orderMatching: {
    // The interval (in milliseconds) at which the matching engine processes orders
    interval: 1000 // 1 second
  }
};

// Function to validate the configuration
function validateConfig() {
  if (!config.rabbitMQ.url) {
    console.error(kleur.red('RABBITMQ_URL is not set in the environment variables.'));
    process.exit(1);
  }
}

// Export the config object and validateConfig function so they can be used in other files
module.exports = { config, validateConfig };
