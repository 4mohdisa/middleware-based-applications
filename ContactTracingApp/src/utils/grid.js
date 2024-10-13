// Manages grid boundary and position validation
class Grid {
    constructor(sizeX = 10, sizeY = 10) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    // Generate a random position on the grid
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * this.sizeX),
            y: Math.floor(Math.random() * this.sizeY)
        };
    }

    // Validate the position to ensure it is within the grid boundaries
    validatePosition(x, y) {
        if (x < 0 || y < 0 || x >= this.sizeX || y >= this.sizeY) {
            throw new Error(`Invalid move: (${x}, ${y}) is outside the grid.`);
        }
    }
}

module.exports = Grid;
