import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TemperatureChart from '../components/dashboard/TemperatureChart';

const Dashboard = () => {
    const { API_URL } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/device-data/summary`);
            if (!response.ok) {
                throw new Error('Failed to fetch summary data');
            }
            const data = await response.json();
            setSummary(data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching summary:', err);
            setError('Failed to load summary data. Please try again later.');
        }
    };

    const fetchDevices = async () => {
        try {
            const response = await fetch(`${API_URL}/device-data`);
            if (!response.ok) {
                throw new Error('Failed to fetch device data');
            }
            const data = await response.json();
            setDevices(data);
        } catch (err) {
            console.error('Error fetching devices:', err);
            setError('Failed to load device data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);
        await Promise.all([fetchSummary(), fetchDevices()]);
    };

    useEffect(() => {
        loadData();

        // Set up auto-refresh
        const intervalId = setInterval(() => {
            loadData();
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [refreshInterval]);

    const handleRefreshChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setRefreshInterval(value);
    };

    const handleManualRefresh = () => {
        loadData();
    };

    if (loading && !summary) {
        return (
            <div className="dashboard loading">
                <div className="spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>IoT Dashboard</h1>
                <div className="refresh-controls">
                    <select
                        value={refreshInterval}
                        onChange={handleRefreshChange}
                        className="refresh-select"
                    >
                        <option value="10">Refresh: 10s</option>
                        <option value="30">Refresh: 30s</option>
                        <option value="60">Refresh: 1m</option>
                        <option value="300">Refresh: 5m</option>
                    </select>
                    <button
                        onClick={handleManualRefresh}
                        className="refresh-button"
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Now'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <div className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
            </div>

            {summary && (
                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>Total Records</h3>
                        <div className="card-value">{summary.totalRecords}</div>
                    </div>
                    <div className="summary-card">
                        <h3>Active Devices</h3>
                        <div className="card-value">{summary.activeDeviceCount}</div>
                    </div>
                    <div className="summary-card">
                        <h3>Avg Temperature</h3>
                        <div className="card-value">{summary.averageTemperature}°C</div>
                    </div>
                    <div className="summary-card">
                        <h3>Temperature Range</h3>
                        <div className="card-value">
                            {summary.minTemperature}°C - {summary.maxTemperature}°C
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-charts">
                <div className="chart-container">
                    <h2>Temperature Trends</h2>
                    <TemperatureChart data={devices} />
                </div>
            </div>

            <div className="recent-devices">
                <h2>Recent Device Activity</h2>
                {devices.length > 0 ? (
                    <table className="devices-table">
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Status</th>
                                <th>Temperature</th>
                                <th>Humidity</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.slice(0, 5).map((device, index) => (
                                <tr key={index}>
                                    <td>{device.device_Id}</td>
                                    <td>
                                        <span className={`status-badge ${device.status}`}>
                                            {device.status}
                                        </span>
                                    </td>
                                    <td>{device.data?.temp}°C</td>
                                    <td>{device.data?.humidity}%</td>
                                    <td>{new Date(device.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No recent device activity</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;