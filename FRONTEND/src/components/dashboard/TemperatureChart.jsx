import React, { useEffect, useRef } from 'react';

const TemperatureChart = ({ data }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!data || data.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear previous chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sort data by timestamp
        const sortedData = [...data]
            .filter(item => item.data && typeof item.data.temp === 'number')
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .slice(-20); // Only show last 20 data points

        if (sortedData.length === 0) return;

        // Extract temperatures and timestamps
        const temperatures = sortedData.map(item => item.data.temp);
        const timestamps = sortedData.map(item => new Date(item.timestamp));

        // Find min and max values for scaling
        const minTemp = Math.min(...temperatures) - 2;
        const maxTemp = Math.max(...temperatures) + 2;

        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw temperature points and connect them
        ctx.beginPath();
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;

        sortedData.forEach((item, index) => {
            const x = padding + (index / (sortedData.length - 1)) * chartWidth;
            const y = canvas.height - padding - ((item.data.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Draw temperature value
            if (index % Math.ceil(sortedData.length / 5) === 0) { // Show only a few labels to avoid crowding
                ctx.fillStyle = '#333';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${item.data.temp}°C`, x, y - 10);
            }
        });

        ctx.stroke();

        // Draw Y-axis labels (temperatures)
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';

        const tempStep = (maxTemp - minTemp) / 5;
        for (let i = 0; i <= 5; i++) {
            const temp = minTemp + tempStep * i;
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.fillText(`${temp.toFixed(1)}°C`, padding - 5, y + 3);
        }

        // Draw X-axis labels (timestamps)
        ctx.textAlign = 'center';

        for (let i = 0; i < timestamps.length; i += Math.ceil(timestamps.length / 5)) {
            const x = padding + (i / (sortedData.length - 1)) * chartWidth;
            const time = timestamps[i].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            ctx.fillText(time, x, canvas.height - padding + 15);
        }

        // Draw chart title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Temperature Over Time', canvas.width / 2, 20);

    }, [data]);

    return (
        <div className="temperature-chart">
            {(!data || data.length === 0) ? (
                <div className="no-data-message">No temperature data available</div>
            ) : (
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={300}
                    className="chart-canvas"
                />
            )}
        </div>
    );
};

export default TemperatureChart;