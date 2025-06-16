// Handler for PUT /device-data/status: Updates device status (requires auth)
const { updateItem } = require('../../utils/dynamoDB');

const handle = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const device_Id = body.device_Id;
    const timestamp = body.timestamp;
    const status = body.status;
    const user = event.user; // From auth middleware

    if (!device_Id || !timestamp || !status) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing device_Id, timestamp, or status' })
        };
    }

    try {
        await updateItem(device_Id, timestamp, { status });
        console.log(`User ${user.email} updated status for device ${device_Id}`);
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