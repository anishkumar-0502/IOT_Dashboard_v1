// Route definitions for the IoT Pulse backend
const postDataHandler = require('../handlers/device/postData');
const getDataHandler = require('../handlers/device/getData');
const updateStatusHandler = require('../handlers/device/updateStatus');
const deleteOldDataHandler = require('../handlers/device/deleteOldData');
const getSummaryHandler = require('../handlers/device/getSummary');
const registerHandler = require('../handlers/auth/register');
const loginHandler = require('../handlers/auth/login');
const logoutHandler = require('../handlers/auth/logout');

// Define routes with their corresponding handlers and HTTP methods
const routes = [
    { method: 'POST', path: '/device-data', handler: postDataHandler.handle },
    { method: 'GET', path: '/device-data', handler: getDataHandler.handle },
    { method: 'PUT', path: '/device-data/status', handler: updateStatusHandler.handle, requiresAuth: true },
    { method: 'DELETE', path: '/device-data/old', handler: deleteOldDataHandler.handle, requiresAuth: true },
    { method: 'GET', path: '/device-data/summary', handler: getSummaryHandler.handle },
    { method: 'POST', path: '/auth/register', handler: registerHandler.handle },
    { method: 'POST', path: '/auth/login', handler: loginHandler.handle },
    { method: 'POST', path: '/auth/logout', handler: logoutHandler.handle }
];

module.exports = routes;