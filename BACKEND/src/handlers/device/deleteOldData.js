// Handler for DELETE /device-data/old: Deletes old records (requires auth)
const { scanItems, deleteItem } = require('../../utils/dynamoDB');

const handle = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const cutoffTimestamp = body.cutoffTimestamp;
    const user = event.user; // From auth middleware

    if (!cutoffTimestamp) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing cutoffTimestamp' })
        };
    }

    try {
        const items = await scanItems();
        const oldItems = items.filter(item => item.timestamp < cutoffTimestamp);

        for (const item of oldItems) {
            await deleteItem(item.deviceId, item.timestamp);
        }

        console.log(`User ${user.email} deleted ${oldItems.length} old records`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Deleted ${oldItems.length} old records` })
        };
    } catch (error) {
        console.error('Error in deleteOldData:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to delete old data' })
        };
    }
};

module.exports = { handle };