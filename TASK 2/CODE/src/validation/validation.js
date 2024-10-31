// Import the kleur library for coloring console output
const kleur = require('kleur');

// Import the config object from the config.js file in the utils folder
const { config } = require('../utils/config');

// Define a function to validate command-line arguments
function validateCommandLineArgs(args) {
  // Check if the correct number of arguments is provided (should be 6)
  if (args.length !== 6) {
    // If not, throw an error with usage instructions
    throw new Error('Invalid number of arguments. Usage: node .\\src\\trader\\trader.js <username> <stock> <BUY|SELL> <price>');
  }

  // Destructure the arguments array, skipping the first two elements (node executable and script path)
  const [,, username, stock, side, price] = args;

  // Validate username
  // Check if username is falsy, not a string, or an empty string after trimming
  if (!username || typeof username !== 'string' || username.trim() === '') {
    // If invalid, throw an error
    throw new Error('Invalid username. Username must be a non-empty string.');
  }

  // Validate stock symbol
  // Check if the provided stock is in the list of valid stocks from the config
  if (!config.stocks.includes(stock)) {
    // If not, throw an error listing the available stocks
    throw new Error(`Invalid stock symbol. Available stocks: ${config.stocks.join(', ')}`);
  }

  // Validate side (either BUY or SELL)
  // Check if the side is neither "BUY" nor "SELL"
  if (side !== 'BUY' && side !== 'SELL') {
    // If invalid, throw an error
    throw new Error('Invalid side. The side must be either "BUY" or "SELL".');
  }

  // Validate price
  // Convert the price string to a float
  const parsedPrice = parseFloat(price);
  // Check if the parsed price is not a number or is less than or equal to 0
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    // If invalid, throw an error
    throw new Error('Invalid price. Price must be a positive number.');
  }

  // If all validations pass, return an object with the validated arguments
  return { username, stock, side, price: parsedPrice };
}

// Export the validateCommandLineArgs function so it can be used in other files
module.exports = { validateCommandLineArgs };
