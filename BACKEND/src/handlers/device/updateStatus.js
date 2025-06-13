// Handler for PUT /device-data/status: Updates device status (requires auth)
const { updateItem } = require('../../utils/dynamoDB');

const handle = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const deviceId = body.deviceId;
    const timestamp = body.timestamp;
    const status = body.status;
    const user = event.user; // From auth middleware

    if (!deviceId || !timestamp || !status) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing deviceId, timestamp, or status' })
        };
    }

    try {
        await updateItem(deviceId, timestamp, { status });
        console.log(`User ${user.email} updated status for device ${deviceId}`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Status updated successfully' })
        };
    } catch (error) {
        console.error('Error in updateStatus:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update status' })
        };
    }
};

module.exports = { handle };