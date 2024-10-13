const kleur = require('kleur');
const { connectToRabbitMQ, createChannel } = require('../utils/rabbitmq');
const { config, validateConfig } = require('../utils/config');
const { validateCommandLineArgs } = require('../validation/validation');

// Fixed quantity for all orders
const FIXED_QUANTITY = 100;

async function sendOrder(username, stock, side, price) {
  validateConfig();  // Validate configuration
  
  try {
    // Connect to RabbitMQ
    const connection = await connectToRabbitMQ();
    const channel = await createChannel(connection);

    // Create the order object with fixed quantity of 100 shares
    const order = { username, stock, side, price, quantity: FIXED_QUANTITY };

    // Publish the order to the RabbitMQ exchange
    await channel.publish(config.rabbitMQ.exchangeName, config.rabbitMQ.ordersTopic, Buffer.from(JSON.stringify(order)));

    // Display the order in a table format
    console.log(kleur.green().bold('\nOrder Submitted:'));
    console.table([
      { Username: username, Stock: stock, Side: side, Price: price, Quantity: FIXED_QUANTITY }
    ]);

    // Close the RabbitMQ channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(kleur.red('Error sending order:'), error.message);
    process.exit(1);  // Exit the process if there's an error
  }
}

// Get user input from command line arguments
const args = process.argv;

try {
  // Validate the command-line arguments and extract validated values
  const { username, stock, side, price } = validateCommandLineArgs(args);

  // Call the function to send the order after validation
  sendOrder(username, stock, side, price);

} catch (error) {
  // Handle validation errors and provide feedback to the user
  console.error(kleur.red(`Input Error: ${error.message}`));
  console.log(kleur.yellow('Usage: node .\\src\\trader\\trader.js <username> <stock> <BUY|SELL> <price>'));
  process.exit(1);
}
