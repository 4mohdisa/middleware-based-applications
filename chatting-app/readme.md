# Chatting App

This project is a simple chatting application that uses RabbitMQ for message brokering. Below are the instructions to set up the project, including how to install Docker and RabbitMQ, and how to run the application.

## Prerequisites

- Docker installed on your system. If you don't have Docker, you can download and install it from the [official Docker website](https://www.docker.com/products/docker-desktop).

## Setting Up RabbitMQ

1. **Install Docker**: Make sure Docker is installed and running on your system.

2. **Run RabbitMQ Container**: Open a terminal or command prompt and run the following command to download and start a RabbitMQ container:

    ```sh
    docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```

    This command does the following:
    - `-d`: Runs the container in detached mode (in the background)
    - `--name rabbitmq`: Names the container "rabbitmq" for easy reference
    - `-p 5672:5672`: Maps the AMQP port
    - `-p 15672:15672`: Maps the management UI port
    - `rabbitmq:3-management`: Uses the RabbitMQ image with the management plugin

3. **Verify Container**: Wait for a moment while Docker downloads the image and starts the container. You can check if the container is running with:

    ```sh
    docker ps
    ```

    You should see a container named "rabbitmq" in the list.

4. **Access RabbitMQ Management Interface**: The RabbitMQ management interface should now be accessible at [http://localhost:15672](http://localhost:15672). You can open this in a web browser. The default login credentials are:
    - **Username**: guest
    - **Password**: guest

## Configuring the Application

1. **Update .env File**: Make sure your `.env` file has the correct RabbitMQ URL. It should look like this:

    ```env
    RABBITMQ_URL=amqp://localhost:5672
    RABBITMQ_EXCHANGE=chat_room
    ```

## Running the Chat Application

With RabbitMQ running and your `.env` file configured, you should now be able to run your chat application:

```sh
node chat_app.js <username>
```

Replace `<username>` with your desired username.

## Troubleshooting

If you encounter issues connecting to RabbitMQ, here are a few things to check:

1. **Check if the Docker container is running**:

    ```sh
    docker ps
    ```

2. **Check Docker logs for any errors**:

    ```sh
    docker logs rabbitmq
    ```

3. **Ensure your firewall isn't blocking the connection**.

4. **Restart the Docker container**:

    ```sh
    docker stop rabbitmq
    docker start rabbitmq
    ```

If you're still having trouble after these steps, please let me know, and we can troubleshoot further.
