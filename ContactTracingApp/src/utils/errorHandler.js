const kleur = require('kleur');

// Custom Error class for handling specific types of errors (optional)
class CustomError extends Error {
    constructor(message, type) {
        super(message);
        this.name = this.constructor.name;
        this.type = type; // You can add a custom error type to identify the error
        Error.captureStackTrace(this, this.constructor);
    }
}

// Function to log error details to the console
function logError(error) {
    if (error instanceof CustomError) {
        console.error(kleur.red(`[${error.type} Error]: ${error.message}`));
    } else if (error instanceof Error) {
        console.error(kleur.red(`[Error]: ${error.message}`));
    } else {
        console.error(kleur.red(`[Unknown Error]: ${error}`));
    }

    if (error.stack) {
        console.error(kleur.gray(error.stack));
    }
}

// Function to handle RabbitMQ connection errors
function handleRabbitMQError(error) {
    logError(new CustomError('Failed to connect to RabbitMQ. Please check your connection settings.', 'RabbitMQ'));
    process.exit(1); // Exit the process if the connection fails
}

// Function to handle general application errors
function handleApplicationError(error, exitOnError = true) {
    logError(error);

    // Optional: Exit the process after logging the error
    if (exitOnError) {
        process.exit(1);
    }
}

// Function to handle validation errors (e.g., invalid input, out-of-bound movements)
function handleValidationError(message) {
    const error = new CustomError(message, 'Validation');
    logError(error);
    process.exit(1); // Exit the process on validation failure
}

module.exports = {
    CustomError,
    logError,
    handleRabbitMQError,
    handleApplicationError,
    handleValidationError,
};
