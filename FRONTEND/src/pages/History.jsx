import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const History = () => {
    const { API_URL } = useContext(AuthContext);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        deviceId: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchHistoryData();
    }, [API_URL]);

    const fetchHistoryData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/device-data`);
            if (!response.ok) {
                throw new Error('Failed to fetch history data');
            }
            const data = await response.json();

            // Sort by timestamp (newest first)
            const sortedData = [...data].sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );

            setHistoryData(sortedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Failed to load history data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        let filtered = [...historyData];

        if (filter.deviceId) {
            filtered = filtered.filter(item =>
                item.device_Id.toLowerCase().includes(filter.deviceId.toLowerCase())
            );
        }

        if (filter.startDate) {
            const startDate = new Date(filter.startDate);
            filtered = filtered.filter(item =>
                new Date(item.timestamp) >= startDate
            );
        }

        if (filter.endDate) {
            const endDate = new Date(filter.endDate);
            endDate.setHours(23, 59, 59, 999); // End of the day
            filtered = filtered.filter(item =>
                new Date(item.timestamp) <= endDate
            );
        }

        return filtered;
    };

    const filteredData = applyFilters();

    if (loading && historyData.length === 0) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading history data...</p>
            </div>
        );
    }

    return (
        <div className="history-page">
            <h1>Device History</h1>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <div className="filter-container">
                <div className="filter-group">
                    <label htmlFor="deviceId">Device ID:</label>
                    <input
                        type="text"
                        id="deviceId"
                        name="deviceId"
                        value={filter.deviceId}
                        onChange={handleFilterChange}
                        placeholder="Filter by device ID"
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={filter.startDate}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={filter.endDate}
                        onChange={handleFilterChange}
                    />
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchHistoryData}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            <div className="history-container">
                {filteredData.length > 0 ? (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Timestamp</th>
                                <th>Temperature</th>
                                <th>Humidity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.device_Id}</td>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    <td>{item.data?.temp}°C</td>
                                    <td>{item.data?.humidity}%</td>
                                    <td>
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No history data found</p>
                )}
            </div>
        </div>
    );
};

export default History;