Contact Tracing System
# Overview

This project is a Contact Tracing System designed for tracking individuals' movements on a configurable 2D grid and recording when people come into contact with one another. It is built using Node.js and RabbitMQ to handle real-time communication, with each person moving randomly across the grid and publishing their position. A central tracker listens for these movements and logs contacts when two people share the same position.

## Features

- Randomized movement of individuals on a 2D grid.
- Real-time tracking of individuals' positions.
- Detection and logging of contact when individuals share the same position.
- Configurable grid size, movement speed, and command-line interface.
- RabbitMQ as the messaging middleware to handle movement updates and queries.

## Packages Used

- **Node.js**: The runtime environment for the application.
- **amqplib**: For communicating with RabbitMQ and handling message queues.
- **kleur**: For adding colored and styled output to the terminal, making logs easier to read.
- **dotenv**: For loading environment variables from the `.env` file.

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/contact-tracing-system.git
```

### Step 2: Navigate to the Project Directory

```bash
cd contact-tracing-system
```

### Step 3: Install Dependencies

Run the following command to install the required Node.js packages:

```bash
npm install
```

### Step 4: Set Up the `.env` File

Create a `.env` file in the root directory with the following variables:

```ini
RABBITMQ_URL=amqp://localhost   # RabbitMQ server URL
DEFAULT_GRID_SIZE=10            # Default size of the grid (can be overridden by command-line arguments)
```

## Running the Application

### Step 1: Start the RabbitMQ Server

Ensure RabbitMQ is running on your local machine. If you have Docker installed, you can start RabbitMQ with:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### Step 2: Running the Tracker

The tracker listens to the position topic and logs when two people come into contact. Start it with the following command:

```bash
node tracker.js
```

### Step 3: Running a Person Simulation

To simulate a person moving on the grid, run:

```bash
node person.js <username> <gridSize>
```

Example:

```bash
node person.js Alice 20
```

This starts a simulation where Alice moves randomly on a 20x20 grid, publishing her movements to RabbitMQ.

## File Structure and Explanation

### 1. `person.js`

This file simulates an individual's movement on the grid. It publishes the person's position to RabbitMQ at regular intervals. Key functionalities:

- `getRandomPosition`: Generates a random coordinate on the grid.
- `startPerson`: Connects to RabbitMQ and publishes the person's movements to the position topic.
- **Error Handling**: Uses `errorHandler.js` for graceful error management.

### 2. `tracker.js`

This file tracks the positions of all individuals. It subscribes to the position topic and logs contacts when individuals share the same position. Key functionalities:

- `startTracker`: Connects to RabbitMQ and listens for position updates. Calls `checkForContacts` to log when two people meet.
- `checkForContacts`: Compares the position of the moving individual with all other tracked positions and logs contacts.

### 3. `utils/rabbitmq.js`

This utility module is responsible for establishing RabbitMQ connections. Key functions:

- `connectToRabbitMQ`: Creates a connection to the RabbitMQ server and returns a channel for communication.

### 4. `utils/grid.js`

Handles grid-related logic, including random position generation and boundary validation. Key functionalities:

- **Grid Class**: Initializes the grid with a configurable size and contains methods for position generation and validation.

### 5. `utils/errorHandler.js`

Centralized error handling module for logging and managing errors. Key functions:

- `logError`: Logs the error to the console with additional details like stack trace.
- `handleRabbitMQError`: Logs RabbitMQ connection errors and exits the process.
- `handleApplicationError`: General-purpose error handler for application-level errors.
- `handleValidationError`: Handles validation errors, such as invalid grid moves.

## Running Commands

- **Run the Tracker**: `node tracker.js`
- **Run a Person**: `node person.js <username> <gridSize>`

Example:

```bash
node person.js Alice 20
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or suggestions, please contact [isaxxcode@gmail.com](mailto:isaxxcode@gmail.com).