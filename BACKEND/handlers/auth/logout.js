// Handler for POST /auth/logout: Instructs client to invalidate JWT
const handle = async () => {
    // Since JWTs are stateless, logout is handled client-side by deleting the token
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Logout successful. Please remove the token on the client.' })
    };
};

module.exports = { handle };