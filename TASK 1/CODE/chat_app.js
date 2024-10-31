// Importing the 'amqplib' package to interact with RabbitMQ.
const amqp = require('amqplib');

// Importing the 'readline' package to handle user input from the command line.
const readline = require('readline');

// Importing the 'kleur' package to add color to console output.
const kleur = require('kleur');

// Importing the configuration settings from the 'config' file.
const { config } = require('./config');

/**
 * Establishes a connection to RabbitMQ.
 * @returns {Promise<amqp.Connection>} A promise that resolves to a RabbitMQ connection.
 */
async function connectToRabbitMQ() {
  try {
    // Attempt to connect to RabbitMQ using the URL from the config.
    const connection = await amqp.connect(config.rabbitMQ.url);
    // Log a success message if the connection is established.
    console.log(kleur.green('Connected to RabbitMQ'));
    // Return the established connection.
    return connection;
  } catch (error) {
    // Log an error message if the connection fails.
    console.error(kleur.red('Failed to connect to RabbitMQ:'), error.message);
    // Exit the process with a failure code.
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
    // Create a channel from the RabbitMQ connection.
    const channel = await connection.createChannel();
    // Assert an exchange of type 'fanout' which broadcasts all messages to all queues.
    await channel.assertExchange(config.rabbitMQ.exchange, 'fanout', { durable: false });
    // Log a success message if the channel and exchange are set up.
    console.log(kleur.green('Channel and exchange setup complete'));
    // Return the created channel.
    return channel;
  } catch (error) {
    // Log an error message if setting up the channel fails.
    console.error(kleur.red('Failed to setup channel:'), error.message);
    // Exit the process with a failure code.
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
    // Assert a queue with a generated name that is exclusive to this connection.
    const q = await channel.assertQueue('', { exclusive: true });
    // Bind the queue to the exchange so it can receive messages.
    await channel.bindQueue(q.queue, config.rabbitMQ.exchange, '');
    // Log a success message if the queue is set up.
    console.log(kleur.green('Queue setup complete'));
    // Return the name of the queue.
    return q.queue;
  } catch (error) {
    // Log an error message if setting up the queue fails.
    console.error(kleur.red('Failed to setup queue:'), error.message);
    // Exit the process with a failure code.
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
      const [sender, ...contentParts] = message.split(':');
      const content = contentParts.join(':').trim();
      if (sender !== username && content) {
        // Remove the newline character before the message
        process.stdout.write('\r');
        // Clear the current line
        process.stdout.clearLine();
        // Move the cursor to the beginning of the line
        process.stdout.cursorTo(0);
        // Print the received message
        console.log(kleur.cyan(`${sender}:`) + kleur.white(` ${content}`));
        // Re-print the prompt and the current input
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
    // Start consuming messages from the specified queue using the message handler.
    await channel.consume(queueName, messageHandler, { noAck: true });
    // Log a success message if consuming starts.
    console.log(kleur.green('Started consuming messages'));
  } catch (error) {
    // Log an error message if starting to consume fails.
    console.error(kleur.red('Failed to start consuming:'), error.message);
    // Exit the process with a failure code.
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
    // Only publish if the message is not empty
    if (message.trim()) {
      // Publish the message to the exchange with the sender's username
      await channel.publish(config.rabbitMQ.exchange, '', Buffer.from(`${username}: ${message}`));
    }
  } catch (error) {
    // Log an error message if publishing the message fails.
    console.error(kleur.red('Failed to publish message:'), error.message);
  }
}

/**
 * Main function to run the chat application.
 */
async function main() {
  // Check if the username is provided as a command line argument.
  if (process.argv.length !== 3) {
    // Log a usage message if the username is not provided.
    console.log(kleur.yellow('Usage: node chat_app.js <username>'));
    // Exit the process with a failure code.
    process.exit(1);
  }

  // Get the username from the command line arguments.
  const username = process.argv[2];

  try {
    // Establish a connection to RabbitMQ.
    const connection = await connectToRabbitMQ();
    // Set up a channel using the established connection.
    const channel = await setupChannel(connection);
    // Set up a queue using the created channel.
    const queueName = await setupQueue(channel);

    // Create a readline interface for user input.
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: kleur.green(`${username} > `)
    });

    // Create a message handler for incoming messages.
    const messageHandler = createMessageHandler(username, rl);
    // Start consuming messages from the queue.
    await startConsuming(channel, queueName, messageHandler);

    // Log a message indicating the user is logged in and can start typing messages.
    console.log(kleur.yellow(`Logged in as ${username}. Type your messages and press Enter to send.`));
    // Prompt the user for input.
    rl.prompt();

    // Handle the 'line' event when the user inputs a message.
    rl.on('line', async (input) => {
      const trimmedInput = input.trim();
      
      if (trimmedInput.toLowerCase() === '/exit') {
        console.log(kleur.yellow('Exiting chat...'));
        await connection.close();
        process.exit(0);
      }
      
      if (trimmedInput) {
        await publishMessage(channel, username, trimmedInput);
        // Clear the current line after sending the message
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
      }
      
      // Prompt the user for input again
      rl.prompt();
    });

    // Handle the 'SIGINT' event (Ctrl+C) to gracefully close the connection and exit.
    process.on('SIGINT', async () => {
      console.log(kleur.yellow('\nReceived SIGINT. Closing connection and exiting...'));
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    // Log an error message if an unexpected error occurs.
    console.error(kleur.red('An unexpected error occurred:'), error.message);
    // Exit the process with a failure code.
    process.exit(1);
  }
}

// Call the main function to run the chat application.
main();
