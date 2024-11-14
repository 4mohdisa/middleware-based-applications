# Prototype Collection: Chat Application, Trading Platform, and Contact Tracing System

## Introduction

This repository contains three distinct prototypes developed as part of a project-based learning initiative. Each prototype explores different technical domains and implements practical features in real-time communication, trading, and contact tracing. The prototypes include:

### 1. Console-Based Chat Application
A command-line interface (CLI) chat application that enables real-time messaging between users in a shared chat room. The application uses RabbitMQ for message handling, allowing multiple users to communicate simultaneously. This project highlights messaging architecture and real-time communication principles.

### 2. Trading Platform
A simple trading system simulating a stock exchange environment where users can place buy and sell orders for a single stock, XYZ Corp. This prototype includes two main actors: a trader, who places orders, and an exchange, which matches orders and processes trades. It provides insights into order management, matching algorithms, and message queuing using RabbitMQ.

### 3. Contact Tracing System
A contact tracing application modeled on a configurable 2D grid environment. Each user occupies a unique position on the grid and moves randomly, logging any contact with others in the same grid position. This prototype demonstrates real-time tracking, position management, and event-driven messaging for contact notification.

## Folder Structure

Each prototype is located in its own folder within this repository, containing all necessary source code, documentation, and configuration files. The primary structure is as follows:

```
/prototype-collection
│
├── /chat-application
│   ├── src
│   ├── README.md
│   └── ...
│
├── /trading-platform
│   ├── src
│   ├── README.md
│   └── ...
│
└── /contact-tracing
    ├── src
    ├── README.md
    └── ...
```

## Prototype Overviews

### Console-Based Chat Application
- **Objective:** Enable real-time messaging in a shared chat room.
- **Technologies:** JavaScript, RabbitMQ, Node.js
- **Features:**
  - User authentication via username
  - Real-time messaging with display of active users
  - Command-line interface with basic error handling

### Trading Platform
- **Objective:** Simulate a stock trading platform for order matching and processing trades.
- **Technologies:** JavaScript, RabbitMQ, Node.js
- **Features:**
  - User roles: trader and exchange
  - Matching engine for buy and sell orders
  - Real-time trade updates in the console

### Contact Tracing System
- **Objective:** Track users’ movements on a grid and log contact events.
- **Technologies:** JavaScript, RabbitMQ, Node.js
- **Features:**
  - Configurable grid size
  - Randomized user movement with real-time position updates
  - Contact logging and notification for users in the same grid location

## Setup and Installation

Each prototype has its own setup requirements. Refer to the README file in each prototype folder for specific instructions on installation and running the application. Basic dependencies across all projects include:

- **Node.js:** For JavaScript runtime
- **RabbitMQ:** For message queuing, ideally set up using Docker for ease of configuration

## Conclusion

These prototypes represent a versatile set of applications across different technical domains, providing practical experience in message handling, real-time systems, and event-driven architecture. They serve as an educational foundation for understanding core principles in communication, trading systems, and contact tracing within a command-line interface.

---
