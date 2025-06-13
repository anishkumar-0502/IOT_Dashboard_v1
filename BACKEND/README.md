# IoT dashboard Backend

This directory contains the AWS Lambda backend for the IoT dashboard project, handling data from IoT devices, serving the frontend, and managing user authentication.

## File Structure

- **src/index.js**: Main Lambda entry point.
- **src/handlers/**: Handler functions for device operations and authentication.
- **src/middleware/**: Middleware for authentication.
- **src/utils/**: Utility functions for DynamoDB and authentication.
- **src/config/**: Configuration settings.
- **src/routes/**: Route definitions.
- **package.json**: Dependencies and scripts.
- **README.md**: Documentation (this file).

## Prerequisites

- AWS account with Lambda, API Gateway, and DynamoDB set up.
- DynamoDB tables: `DeviceData` (for IoT data) and `Users` (for user data).
- Node.js installed locally to generate `node_modules`.

## Setup

1. Navigate to this directory: `cd iot-dashboard-backend`.
2. Install dependencies: `npm install`.
3. Update `src/config/config.js` with your DynamoDB table names and a secure JWT secret.
4. Zip the contents: `npm run zip`.
5. In AWS Lambda, create a function named `IoTdashboardHandler` (Node.js 18.x).
6. Upload the `iot-dashboard-backend.zip` file to Lambda.
7. Configure API Gateway to route requests to this Lambda function (see below).

## API Endpoints

- **POST /device-data**: Stores data from IoT devices (API key required).
- **GET /device-data**: Retrieves all device data (API key required).
- **PUT /device-data/status**: Updates device status (JWT required).
- **DELETE /device-data/old**: Deletes records older than a timestamp (JWT required).
- **GET /device-data/summary**: Returns a summary of device data (API key required).
- **POST /auth/register**: Registers a new user.
- **POST /auth/login**: Logs in a user and returns a JWT.
- **POST /auth/logout**: Instructs the client to invalidate the JWT (client-side).

## Notes

- Secure your JWT secret in `config.js`.
- Use API keys in API Gateway for device and frontend requests.
- Use JWTs for user authentication on protected endpoints.
