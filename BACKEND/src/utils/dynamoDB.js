// Utility functions for DynamoDB interactions
const AWS = require('aws-sdk');
const { dynamoDB } = require('../config/config'); // ✅ Corrected import

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const deviceDataTable = dynamoDB.deviceDataTable; // ✅ Get actual table name

const putItem = async (item, table = deviceDataTable) => {
    const params = {
        TableName: table,
        Item: item
    };
    return dynamoDb.put(params).promise();
};

const scanItems = async (table = deviceDataTable) => {
    const params = {
        TableName: table
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items || [];
};

const updateItem = async (deviceId, timestamp, updates, table = deviceDataTable) => {
    const updateExpression = Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    Object.keys(updates).forEach(key => {
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updates[key];
    });

    const params = {
        TableName: table,
        Key: { deviceId, timestamp },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
    return dynamoDb.update(params).promise();
};

const deleteItem = async (deviceId, timestamp, table = deviceDataTable) => {
    const params = {
        TableName: table,
        Key: { deviceId, timestamp }
    };
    return dynamoDb.delete(params).promise();
};

module.exports = { putItem, scanItems, updateItem, deleteItem };
