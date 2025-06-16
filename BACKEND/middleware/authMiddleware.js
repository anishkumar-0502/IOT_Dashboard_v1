// Middleware to authenticate requests using JWT
const { verifyToken } = require('../utils/auth');

const authMiddleware = async (event) => {
    const headers = event.headers || {};
    const token = headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Missing authorization token' })
        };
    }

    const user = verifyToken(token);
    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid or expired token' })
        };
    }

    return { user };
};

module.exports = authMiddleware;