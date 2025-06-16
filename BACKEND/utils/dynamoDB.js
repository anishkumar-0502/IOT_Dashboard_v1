// Utility functions for DynamoDB interactions
const AWS = require('aws-sdk');
const { dynamoDB, aws } = require('../config/config'); // Import AWS region config too

// Configure AWS SDK with the region
AWS.config.update({ region: aws.region });

// Check if we're running locally with SAM CLI
const isLocalDevelopment = process.env.AWS_SAM_LOCAL === 'true';

// Configure DynamoDB client
let dynamoDbConfig = {};

if (isLocalDevelopment) {
    console.log('Running in local development mode');
    // Return mock data when running locally
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbConfig);
const deviceDataTable = dynamoDB.deviceDataTable; // ✅ Get actual table name

const putItem = async (item, table = deviceDataTable) => {
    if (isLocalDevelopment) {
        console.log('Mock putItem operation:', item);
        return { success: true };
    }

    const params = {
        TableName: table,
        Item: item
    };
    return dynamoDb.put(params).promise();
};

const scanItems = async (table = deviceDataTable) => {
    // Return mock data when running locally
    if (isLocalDevelopment) {
        console.log('Returning mock data for scanItems');
        return [
            {
                device_Id: 'device-001',
                timestamp: new Date().toISOString(),
                temperature: 24.5,
                humidity: 65,
                status: 'active'
            },
            {
                device_Id: 'device-002',
                timestamp: new Date().toISOString(),
                temperature: 22.3,
                humidity: 58,
                status: 'inactive'
            }
        ];
    }

    // Normal operation for cloud deployment
    const params = {
        TableName: table
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items || [];
};

const updateItem = async (device_Id, timestamp, updates, table = deviceDataTable) => {
    if (isLocalDevelopment) {
        console.log('Mock updateItem operation:', { device_Id, timestamp, updates });
        return { success: true };
    }

    const updateExpression = Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    Object.keys(updates).forEach(key => {
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updates[key];
    });

    const params = {
        TableName: table,
        Key: { device_Id, timestamp },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
    return dynamoDb.update(params).promise();
};

const deleteItem = async (device_Id, timestamp, table = deviceDataTable) => {
    if (isLocalDevelopment) {
        console.log('Mock deleteItem operation:', { device_Id, timestamp });
        return { success: true };
    }

    const params = {
        TableName: table,
        Key: { device_Id, timestamp }
    };
    return dynamoDb.delete(params).promise();
};

module.exports = { putItem, scanItems, updateItem, deleteItem };
