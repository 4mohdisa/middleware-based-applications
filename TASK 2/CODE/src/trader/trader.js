// Import the kleur library for coloring console output
const kleur = require('kleur');

// Import the connectToRabbitMQ and createChannel functions from the rabbitmq.js file
const { connectToRabbitMQ, createChannel } = require('../utils/rabbitmq');

// Import the config object and validateConfig function from the config.js file
const { config, validateConfig } = require('../utils/config');

// Import the validateCommandLineArgs function from the validation.js file
const { validateCommandLineArgs } = require('../validation/validation');

// Define a constant for the fixed quantity of shares in each order
const FIXED_QUANTITY = 100;

// Define an asynchronous function to send an order
async function sendOrder(username, stock, side, price) {
  // Validate the configuration before proceeding
  validateConfig();
  
  try {
    // Connect to RabbitMQ and get a connection object
    const connection = await connectToRabbitMQ();
    // Create a channel using the connection
    const channel = await createChannel(connection);

    // Create an order object with the provided details and fixed quantity
    const order = { username, stock, side, price, quantity: FIXED_QUANTITY };

    // Publish the order to the RabbitMQ exchange
    // Convert the order object to a JSON string and then to a Buffer
    await channel.publish(config.rabbitMQ.exchangeName, config.rabbitMQ.ordersTopic, Buffer.from(JSON.stringify(order)));

    // Display the submitted order in a table format
    console.log(kleur.green().bold('\nOrder Submitted:'));
    console.table([
      { Username: username, Stock: stock, Side: side, Price: price, Quantity: FIXED_QUANTITY }
    ]);

    // Close the RabbitMQ channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    // If an error occurs, log it in red and exit the process
    console.error(kleur.red('Error sending order:'), error.message);
    process.exit(1);
  }
}

// Get the command line arguments
const args = process.argv;

try {
  // Validate the command-line arguments and extract the values
  const { username, stock, side, price } = validateCommandLineArgs(args);

  // Call the sendOrder function with the validated arguments
  sendOrder(username, stock, side, price);

} catch (error) {
  // If validation fails, display an error message in red
  console.error(kleur.red(`Input Error: ${error.message}`));
  // Display usage instructions in yellow
  console.log(kleur.yellow('Usage: node .\\src\\trader\\trader.js <username> <stock> <BUY|SELL> <price>'));
  // Exit the process with an error code
  process.exit(1);
}
