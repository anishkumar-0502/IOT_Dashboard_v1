// Handler for POST /auth/register: Registers a new user
const { v4: uuidv4 } = require('uuid');
const { putItem } = require('../../utils/dynamoDB');
const { hashPassword } = require('../../utils/auth');
const { usersTable } = require('../../config/config');

const handle = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing email or password' })
        };
    }

    // Check if user already exists
    const existingUser = await scanUser(email);
    if (existingUser.length > 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User already exists' })
        };
    }

    const userId = uuidv4();
    const hashedPassword = await hashPassword(password);
    const createdAt = new Date().toISOString();

    const params = {
        email,
        userId,
        password: hashedPassword,
        createdAt
    };

    try {
        await putItem(params, usersTable);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully', userId })
        };
    } catch (error) {
        console.error('Error in register:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to register user' })
        };
    }
};

// Helper function to scan for a user by email
const scanUser = async (email) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: usersTable,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items || [];
};

module.exports = { handle };