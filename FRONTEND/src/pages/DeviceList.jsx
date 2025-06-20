import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DeviceList = () => {
    const { API_URL } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/device-data`);
                if (!response.ok) {
                    throw new Error('Failed to fetch device data');
                }
                const data = await response.json();

                // Group by device_Id to get unique devices
                const deviceMap = {};
                data.forEach(item => {
                    if (!deviceMap[item.device_Id] ||
                        new Date(deviceMap[item.device_Id].timestamp) < new Date(item.timestamp)) {
                        deviceMap[item.device_Id] = item;
                    }
                });

                setDevices(Object.values(deviceMap));
                setError(null);
            } catch (err) {
                console.error('Error fetching devices:', err);
                setError('Failed to load device data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, [API_URL]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading devices...</p>
            </div>
        );
    }

    return (
        <div className="device-list-page">
            <h1>Device List</h1>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <div className="device-list-container">
                {devices.length > 0 ? (
                    <table className="devices-table">
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Temperature</th>
                                <th>Humidity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device, index) => (
                                <tr key={index}>
                                    <td>{device.device_Id}</td>
                                    <td>
                                        <span className={`status-badge ${device.status}`}>
                                            {device.status}
                                        </span>
                                    </td>
                                    <td>{new Date(device.timestamp).toLocaleString()}</td>
                                    <td>{device.data?.temp}°C</td>
                                    <td>{device.data?.humidity}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No devices found</p>
                )}
            </div>
        </div>
    );
};

export default DeviceList;