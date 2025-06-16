// Handler for POST /device-data: Stores data from IoT devices
const { putItem } = require('../../utils/dynamoDB');

const handle = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const device_Id = body.device_Id;
    const data = body.data;

    if (!device_Id || !data || !data.temp) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing device_Id or data.temp' })
        };
    }

    const timestamp = new Date().toISOString();
    const status = 'active';

    const params = {
        device_Id,
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