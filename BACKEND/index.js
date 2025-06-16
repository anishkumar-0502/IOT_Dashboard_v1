// Main Lambda entry point for the IoT Pulse backend
const routes = require('./routes/routes');
const authMiddleware = require('./middleware/authMiddleware');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path;

    try {
        // Find the matching route
        const route = routes.find(r =>
            r.method === httpMethod && r.path.replace(/\/$/, '') === path.replace(/\/$/, '')
        );

        if (!route) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Endpoint not found' })
            };
        }

        // Apply authentication middleware if required
        if (route.requiresAuth) {
            const authResult = await authMiddleware(event);
            if (authResult.statusCode) {
                return authResult; // Return error response if authentication fails
            }
            event.user = authResult.user; // Attach user info to the event
        }

        // Execute the handler for the matched route
        return await route.handler(event);
    } catch (error) {
        console.error('Error in Lambda handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};