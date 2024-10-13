const amqp = require('amqplib');
const kleur = require('kleur');

// Connect to RabbitMQ and return both the connection and the channel
async function connectToRabbitMQ(url) {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        console.log(kleur.green('Connected to RabbitMQ successfully!'));
        return { connection, channel };
    } catch (error) {
        console.error(kleur.red('Failed to connect to RabbitMQ:'), error.message);
        throw new Error('RabbitMQ connection failed.');
    }
}

module.exports = { connectToRabbitMQ };
