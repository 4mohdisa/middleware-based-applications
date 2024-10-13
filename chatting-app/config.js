// config.js
require('dotenv').config();

const config = {
  rabbitMQ: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'chat_room'
  }
};

module.exports = { config };