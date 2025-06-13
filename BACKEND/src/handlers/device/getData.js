// getData.js
const { scanItems } = require('../../utils/dynamoDB');

const handle = async (event) => {
    try {
        const items = await scanItems();
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error('Error in getData:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve data' })
        };
    }
};

module.exports = { handle }; // ✅ must export an object with handle
