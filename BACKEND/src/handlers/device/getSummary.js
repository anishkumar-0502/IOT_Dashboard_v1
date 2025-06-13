// Handler for GET /device-data/summary: Provides a summary of device data
const { scanItems } = require('../../utils/dynamoDB');

const handle = async () => {
    try {
        const items = await scanItems();
        const activeDevices = new Set(items.filter(item => item.status === 'active').map(item => item.deviceId));
        const temperatures = items.map(item => item.data.temp).filter(temp => typeof temp === 'number');

        const summary = {
            totalRecords: items.length,
            activeDeviceCount: activeDevices.size,
            averageTemperature: temperatures.length ? (temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(1) : 'N/A',
            minTemperature: temperatures.length ? Math.min(...temperatures) : 'N/A',
            maxTemperature: temperatures.length ? Math.max(...temperatures) : 'N/A'
        };

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(summary)
        };
    } catch (error) {
        console.error('Error in getSummary:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate summary' })
        };
    }
};

module.exports = { handle };