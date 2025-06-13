// Handler for POST /device-data: Stores data from IoT devices
const { putItem } = require('../../utils/dynamoDB');

const handle = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const deviceId = body.deviceId;
    const data = body.data;

    if (!deviceId || !data || !data.temp) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing deviceId or data.temp' })
        };
    }

    const timestamp = new Date().toISOString();
    const status = 'active';

    const params = {
        deviceId,
        timestamp,
        data,
        status
    };

    try {
        await putItem(params);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data stored successfully' })
        };
    } catch (error) {
        console.error('Error in postData:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to store data' })
        };
    }
};

module.exports = { handle };