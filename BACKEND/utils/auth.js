// Utility functions for authentication (JWT and password hashing)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/config');

const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, userId: user.userId },
        jwtSecret,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

module.exports = { hashPassword, verifyPassword, generateToken, verifyToken };