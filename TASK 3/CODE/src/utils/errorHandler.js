// Import the 'kleur' library for adding colors to console output
const kleur = require('kleur');

// Define a custom error class that extends the built-in Error class
class CustomError extends Error {
    // Constructor for the CustomError class
    constructor(message, type) {
        // Call the parent class (Error) constructor with the error message
        super(message);
        // Set the name property to the name of this class
        this.name = this.constructor.name;
        // Add a custom 'type' property to identify different error types
        this.type = type;
        // Capture the stack trace, excluding the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

// Function to log error details to the console
function logError(error) {
    // Check if the error is an instance of our CustomError class
    if (error instanceof CustomError) {
        // If it is, log the error type and message in red
        console.error(kleur.red(`[${error.type} Error]: ${error.message}`));
    // Check if the error is an instance of the built-in Error class
    } else if (error instanceof Error) {
        // If it is, log the error message in red
        console.error(kleur.red(`[Error]: ${error.message}`));
    // If it's neither CustomError nor Error, treat it as an unknown error
    } else {
        // Log the unknown error in red
        console.error(kleur.red(`[Unknown Error]: ${error}`));
    }

    // If the error object has a stack trace property
    if (error.stack) {
        // Log the stack trace in gray color
        console.error(kleur.gray(error.stack));
    }
}

// Function to handle RabbitMQ connection errors
function handleRabbitMQError(error) {
    // Create a new CustomError with a specific message and type
    logError(new CustomError('Failed to connect to RabbitMQ. Please check your connection settings.', 'RabbitMQ'));
    // Exit the process with a non-zero status code to indicate an error
    process.exit(1);
}

// Function to handle general application errors
function handleApplicationError(error, exitOnError = true) {
    // Log the error using the logError function
    logError(error);

    // If exitOnError is true (default behavior)
    if (exitOnError) {
        // Exit the process with a non-zero status code to indicate an error
        process.exit(1);
    }
}

// Function to handle validation errors (e.g., invalid input, out-of-bound movements)
function handleValidationError(message) {
    // Create a new CustomError with the provided message and 'Validation' type
    const error = new CustomError(message, 'Validation');
    // Log the validation error
    logError(error);
    // Exit the process with a non-zero status code to indicate an error
    process.exit(1);
}

// Export the error handling functions and CustomError class so they can be used in other files
module.exports = {
    CustomError,
    logError,
    handleRabbitMQError,
    handleApplicationError,
    handleValidationError,
};
