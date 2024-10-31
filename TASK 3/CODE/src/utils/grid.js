// This file defines a Grid class to manage grid boundaries and position validation

// Define a class named Grid
class Grid {
    // Constructor function that initializes a new Grid instance
    // It takes two optional parameters: sizeX and sizeY, both defaulting to 10 if not provided
    constructor(sizeX = 10, sizeY = 10) {
        // Set the width of the grid (number of columns)
        this.sizeX = sizeX;
        // Set the height of the grid (number of rows)
        this.sizeY = sizeY;
    }

    // Method to generate a random position on the grid
    getRandomPosition() {
        // Return an object with x and y properties
        return {
            // Generate a random x-coordinate between 0 (inclusive) and sizeX (exclusive)
            x: Math.floor(Math.random() * this.sizeX),
            // Generate a random y-coordinate between 0 (inclusive) and sizeY (exclusive)
            y: Math.floor(Math.random() * this.sizeY)
        };
    }

    // Method to validate if a given position is within the grid boundaries
    // It takes two parameters: x and y coordinates
    validatePosition(x, y) {
        // Check if x is less than 0 OR y is less than 0 OR x is greater than or equal to sizeX OR y is greater than or equal to sizeY
        if (x < 0 || y < 0 || x >= this.sizeX || y >= this.sizeY) {
            // If any of the above conditions are true, throw an error with a descriptive message
            throw new Error(`Invalid move: (${x}, ${y}) is outside the grid.`);
        }
        // If the position is valid (within the grid), the function will complete without throwing an error
    }
}

// Export the Grid class so it can be used in other files
module.exports = Grid;
