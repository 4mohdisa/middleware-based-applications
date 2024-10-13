require('dotenv').config();
const kleur = require('kleur');

// Configuration object for the application
const config = {
  rabbitMQ: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    exchangeName: 'stock_exchange',
    ordersTopic: 'orders',
    tradesTopic: 'trades'
  },
  stocks: ['XYZ'] // List of available stocks, can be extended later
};

// Function to validate the configuration
function validateConfig() {
  if (!config.rabbitMQ.url) {
    console.error(kleur.red('RABBITMQ_URL is not set in the environment variables.'));
    process.exit(1);
  }
}

module.exports = { config, validateConfig };