// Import the connectToRabbitMQ function from the rabbitmq utility file
const { connectToRabbitMQ } = require('../utils/rabbitmq');
// Import the Grid class from the grid utility file
const Grid = require('../utils/grid');
// Import error handling functions from the errorHandler utility file
const { handleApplicationError, handleValidationError } = require('../utils/errorHandler');
// Import the kleur library for adding colors to console output
const kleur = require('kleur');

// Define an asynchronous function to simulate a person's movement on a grid
async function startPerson(username, gridSize) {
    try {
        // Create a new Grid instance with the specified size
        const grid = new Grid(gridSize, gridSize);
        // Connect to RabbitMQ and get the connection and channel
        const { connection, channel } = await connectToRabbitMQ('amqp://localhost');
        
        // Define the name of the queue we'll use
        const queue = 'position';
        // Ensure the queue exists (create it if it doesn't)
        await channel.assertQueue(queue, { durable: false });

        // Set up an interval to move the person every second
        setInterval(() => {
            try {
                // Get a random position on the grid
                const { x, y } = grid.getRandomPosition();
                // Validate that the position is within the grid boundaries
                grid.validatePosition(x, y);

                // Create an object with the person's username and position
                const position = { username, x, y };
                // Send the position data to the RabbitMQ queue
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(position)));
                // Log the person's movement to the console in blue color
                console.log(kleur.blue(`[${username}] Moved to (${x}, ${y})`));
            } catch (error) {
                // If there's an error (e.g., invalid position), handle it as a validation error
                handleValidationError(`Invalid move for ${username}: ${error.message}`);
            }
        }, 1000); // The interval is set to 1000 milliseconds (1 second)

    } catch (error) {
        // If there's an error in the overall simulation, handle it as an application error
        handleApplicationError(`Error in person simulation for ${username}: ${error.message}`);
    }
}

// Get the username from command-line arguments, or use 'User' if not provided
const username = process.argv[2] || 'User';
// Get the grid size from command-line arguments, or use 10 if not provided
const gridSize = parseInt(process.argv[3], 10) || 10;

// Start the person simulation
startPerson(username, gridSize).catch(error => {
    // If there's an error starting the simulation, handle it as an application error
    handleApplicationError(`Error starting person simulation for ${username}: ${error.message}`);
});
