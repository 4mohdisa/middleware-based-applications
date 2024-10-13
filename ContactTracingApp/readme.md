# Contact Tracing App

## Overview
This project is a contact tracing application designed to help track and manage the spread of infectious diseases. The app allows users to log their interactions and receive notifications if they have been in contact with someone who has tested positive.

## Features
- User registration and authentication
- Logging of user interactions
- Notifications for potential exposure
- Data privacy and security

## Packages Used
- **React**: For building the user interface
- **Node.js**: For the backend server
- **Express**: For handling server routes
- **MongoDB**: For the database
- **Mongoose**: For MongoDB object modeling
- **JWT**: For authentication
- **Docker**: For containerization

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/contact-tracing-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd contact-tracing-app
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Setting Up Docker
1. Ensure Docker is installed on your machine.
2. Build the Docker image:
    ```bash
    docker build -t contact-tracing-app .
    ```
3. Run the Docker container:
    ```bash
    docker run -d -p 3000:3000 --env-file .env contact-tracing-app
    ```

## Setting Up .env File
Create a `.env` file in the root directory and add the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Usage
1. Start the development server:
    ```bash
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## File Structure
- **/src**: Contains the source code
  - **/components**: React components
  - **/pages**: Different pages of the application
  - **/services**: API calls and services
  - **/utils**: Utility functions
- **/server**: Contains the backend server code
  - **/models**: Mongoose models
  - **/routes**: Express routes
  - **/controllers**: Route controllers
  - **/middleware**: Middleware functions

## Contributing
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or suggestions, please contact [your-email@example.com](mailto:your-email@example.com).

---

Mohammed Isa & Uzair Shaikh
