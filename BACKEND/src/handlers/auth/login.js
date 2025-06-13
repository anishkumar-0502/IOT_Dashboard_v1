// Handler for POST /auth/login: Logs in a user and issues a JWT
const { verifyPassword, generateToken } = require('../../utils/auth');
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

    // Find user
    const users = await scanUser(email);
    if (users.length === 0) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid email or password' })
        };
    }

    const user = users[0];
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid email or password' })
        };
    }

    // Generate JWT
    const token = generateToken(user);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', token })
    };
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