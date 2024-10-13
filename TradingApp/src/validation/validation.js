const kleur = require('kleur');
const { config } = require('../utils/config');

// Function to validate command-line arguments
function validateCommandLineArgs(args) {
  // Check if the correct number of arguments is provided
  if (args.length !== 6) {
    throw new Error('Invalid number of arguments. Usage: node .\\src\\trader\\trader.js <username> <stock> <BUY|SELL> <price>');
  }

  const [,, username, stock, side, price] = args;

  // Validate username
  if (!username || typeof username !== 'string' || username.trim() === '') {
    throw new Error('Invalid username. Username must be a non-empty string.');
  }

  // Validate stock symbol (Assuming you have a predefined list of valid stocks in `config.stocks`)
  if (!config.stocks.includes(stock)) {
    throw new Error(`Invalid stock symbol. Available stocks: ${config.stocks.join(', ')}`);
  }

  // Validate side (either BUY or SELL)
  if (side !== 'BUY' && side !== 'SELL') {
    throw new Error('Invalid side. The side must be either "BUY" or "SELL".');
  }

  // Validate price (must be a positive number)
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    throw new Error('Invalid price. Price must be a positive number.');
  }

  // If all validations pass, return the validated arguments
  return { username, stock, side, price: parsedPrice };
}

module.exports = { validateCommandLineArgs };
