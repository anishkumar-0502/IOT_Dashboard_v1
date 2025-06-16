// src/config/config.js

require('dotenv').config(); // Load .env variables at startup

module.exports = {
    dynamoDB: {
        deviceDataTable: process.env.DEVICE_DATA_TABLE || 'DeviceData',
        usersTable: process.env.USERS_TABLE || 'Users'
    },

    auth: {
        jwtSecret: process.env.JWT_SECRET || 'fallback-dev-secret',
        tokenExpiry: '2h'
    },

    aws: {
        region: process.env.AWS_REGION || 'ap-south-1'
    },

    logLevel: process.env.LOG_LEVEL || 'info'
};
