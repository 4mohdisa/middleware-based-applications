const { connectToRabbitMQ } = require('../utils/rabbitmq');
const Grid = require('../utils/grid');
const { handleApplicationError, handleValidationError } = require('../utils/errorHandler');
const kleur = require('kleur');

// Simulate a person's movement on a grid
async function startPerson(username, gridSize) {
    try {
        const grid = new Grid(gridSize, gridSize);  // Create a grid with configurable size
        const { connection, channel } = await connectToRabbitMQ('amqp://localhost');
        
        const queue = 'position';
        await channel.assertQueue(queue, { durable: false });

        // Move the person at random positions every second
        setInterval(() => {
            try {
                const { x, y } = grid.getRandomPosition(); // Get a random position on the grid
                grid.validatePosition(x, y); // Ensure the position is within the grid boundaries

                const position = { username, x, y };
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(position)));  // Send position to RabbitMQ
                console.log(kleur.blue(`[${username}] Moved to (${x}, ${y})`));
            } catch (error) {
                handleValidationError(`Invalid move for ${username}: ${error.message}`);  // Handle invalid movement errors
            }
        }, 1000); // Move every second

    } catch (error) {
        handleApplicationError(`Error in person simulation for ${username}: ${error.message}`);  // Handle application-level errors
    }
}

// Get username and grid size from command-line arguments
const username = process.argv[2] || 'User';
const gridSize = parseInt(process.argv[3], 10) || 10; // Default grid size is 10x10 if not provided

// Start the person simulation
startPerson(username, gridSize).catch(error => {
    handleApplicationError(`Error starting person simulation for ${username}: ${error.message}`);  // Catch any errors from async code
});
