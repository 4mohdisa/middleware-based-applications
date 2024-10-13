// chat_app.js
const amqp = require('amqplib');
const readline = require('readline');
const kleur = require('kleur');
const { config } = require('./config');

/**
 * Establishes a connection to RabbitMQ.
 * @returns {Promise<amqp.Connection>} A promise that resolves to a RabbitMQ connection.
 */
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

/**
 * Creates a channel and sets up the exchange.
 * @param {amqp.Connection} connection - The RabbitMQ connection.
 * @returns {Promise<amqp.Channel>} A promise that resolves to a RabbitMQ channel.
 */
async function setupChannel(connection) {
  try {
    const channel = await connection.createChannel();
    await channel.assertExchange(config.rabbitMQ.exchange, 'fanout', { durable: false });
    console.log(kleur.green('Channel and exchange setup complete'));
    return channel;
  } catch (error) {
    console.error(kleur.red('Failed to setup channel:'), error.message);
    process.exit(1);
  }
}

/**
 * Sets up a queue for receiving messages.
 * @param {amqp.Channel} channel - The RabbitMQ channel.
 * @returns {Promise<string>} A promise that resolves to the queue name.
 */
async function setupQueue(channel) {
  try {
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, config.rabbitMQ.exchange, '');
    console.log(kleur.green('Queue setup complete'));
    return q.queue;
  } catch (error) {
    console.error(kleur.red('Failed to setup queue:'), error.message);
    process.exit(1);
  }
}

/**
 * Creates a message handler function.
 * @param {string} username - The current user's username.
 * @param {readline.Interface} rl - The readline interface.
 * @returns {function} A function to handle incoming messages.
 */
function createMessageHandler(username, rl) {
  return (msg) => {
    if (msg.content) {
      const message = msg.content.toString();
      const [sender, content] = message.split(':', 2);
      if (sender !== username) {
        console.log(kleur.cyan(`\n${sender}:`) + kleur.white(` ${content.trim()}`));
        rl.prompt(true);
      }
    }
  };
}

/**
 * Starts consuming messages from the queue.
 * @param {amqp.Channel} channel - The RabbitMQ channel.
 * @param {string} queueName - The name of the queue to consume from.
 * @param {function} messageHandler - The function to handle incoming messages.
 */
async function startConsuming(channel, queueName, messageHandler) {
  try {
    await channel.consume(queueName, messageHandler, { noAck: true });
    console.log(kleur.green('Started consuming messages'));
  } catch (error) {
    console.error(kleur.red('Failed to start consuming:'), error.message);
    process.exit(1);
  }
}

/**
 * Publishes a message to the exchange.
 * @param {amqp.Channel} channel - The RabbitMQ channel.
 * @param {string} username - The sender's username.
 * @param {string} message - The message to send.
 */
async function publishMessage(channel, username, message) {
  try {
    await channel.publish(config.rabbitMQ.exchange, '', Buffer.from(`${username}: ${message}`));
  } catch (error) {
    console.error(kleur.red('Failed to publish message:'), error.message);
  }
}

/**
 * Main function to run the chat application.
 */
async function main() {
  if (process.argv.length !== 3) {
    console.log(kleur.yellow('Usage: node chat_app.js <username>'));
    process.exit(1);
  }

  const username = process.argv[2];

  try {
    const connection = await connectToRabbitMQ();
    const channel = await setupChannel(connection);
    const queueName = await setupQueue(channel);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: kleur.green(`${username} > `)
    });

    const messageHandler = createMessageHandler(username, rl);
    await startConsuming(channel, queueName, messageHandler);

    console.log(kleur.yellow(`Logged in as ${username}. Type your messages and press Enter to send.`));
    rl.prompt();

    rl.on('line', async (input) => {
      if (input.toLowerCase() === '/exit') {
        console.log(kleur.yellow('Exiting chat...'));
        await connection.close();
        process.exit(0);
      }
      await publishMessage(channel, username, input);
      rl.prompt();
    });

    process.on('SIGINT', async () => {
      console.log(kleur.yellow('\nReceived SIGINT. Closing connection and exiting...'));
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(kleur.red('An unexpected error occurred:'), error.message);
    process.exit(1);
  }
}

main();