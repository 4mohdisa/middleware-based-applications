const amqp = require('amqplib');
const kleur = require('kleur');
const { config } = require('./config');

// Function to connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    console.log(kleur.green('Connected to RabbitMQ'));
    return connection;
  } catch (error) {
    console.error(kleur.red('Failed to connect to RabbitMQ:'), error.message);
    process.exit(1);
  }
}

// Function to create a channel and assert exchange
async function createChannel(connection) {
  try {
    const channel = await connection.createChannel();
    await channel.assertExchange(config.rabbitMQ.exchangeName, 'topic', { durable: false });
    console.log(kleur.green('Channel and exchange setup complete'));
    return channel;
  } catch (error) {
    console.error(kleur.red('Failed to create channel:'), error.message);
    process.exit(1);
  }
}

module.exports = { connectToRabbitMQ, createChannel };