import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Status update form
    const [statusForm, setStatusForm] = useState({
        deviceId: '',
        status: 'active'
    });

    // Delete old data form
    const [deleteForm, setDeleteForm] = useState({
        olderThan: 30 // days
    });

    // Profile form
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        notifications: true
    });

    const handleStatusFormChange = (e) => {
        const { name, value } = e.target;
        setStatusForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteFormChange = (e) => {
        const { name, value } = e.target;
        setDeleteForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        if (!statusForm.deviceId) {
            setMessage({ text: 'Device ID is required', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch(`${API_URL}/device-data/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    device_Id: statusForm.deviceId,
                    status: statusForm.status
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update device status');
            }

            setMessage({
                text: `Device ${statusForm.deviceId} status updated to ${statusForm.status}`,
                type: 'success'
            });

            // Reset form
            setStatusForm({
                deviceId: '',
                status: 'active'
            });
        } catch (err) {
            console.error('Error updating status:', err);
            setMessage({
                text: 'Failed to update device status. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOldData = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch(`${API_URL}/device-data/old`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    days: parseInt(deleteForm.olderThan, 10)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete old data');
            }

            const result = await response.json();

            setMessage({
                text: `Successfully deleted ${result.deletedCount || 0} old records`,
                type: 'success'
            });
        } catch (err) {
            console.error('Error deleting old data:', err);
            setMessage({
                text: 'Failed to delete old data. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage({ text: '', type: '' });

        // Simulate API call for profile update
        setTimeout(() => {
            setMessage({
                text: 'Profile settings updated successfully',
                type: 'success'
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-container">
                <div className="settings-section">
                    <h2>Update Device Status</h2>
                    <form onSubmit={handleStatusUpdate}>
                        <div className="form-group">
                            <label htmlFor="deviceId">Device ID:</label>
                            <input
                                type="text"
                                id="deviceId"
                                name="deviceId"
                                value={statusForm.deviceId}
                                onChange={handleStatusFormChange}
                                required
                                placeholder="Enter device ID"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                value={statusForm.status}
                                onChange={handleStatusFormChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Status'}
                        </button>
                    </form>
                </div>

                <div className="settings-section">
                    <h2>Delete Old Data</h2>
                    <form onSubmit={handleDeleteOldData}>
                        <div className="form-group">
                            <label htmlFor="olderThan">Delete data older than:</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="olderThan"
                                    name="olderThan"
                                    value={deleteForm.olderThan}
                                    onChange={handleDeleteFormChange}
                                    min="1"
                                    required
                                />
                                <span className="input-group-text">days</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn danger"
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete Old Data'}
                        </button>
                        <p className="warning-text">Warning: This action cannot be undone!</p>
                    </form>
                </div>

                <div className="settings-section">
                    <h2>Profile Settings</h2>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profileForm.name}
                                onChange={handleProfileFormChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileFormChange}
                                required
                                disabled
                            />
                            <small>Email cannot be changed</small>
                        </div>

                        <div className="form-group checkbox">
                            <input
                                type="checkbox"
                                id="notifications"
                                name="notifications"
                                checked={profileForm.notifications}
                                onChange={handleProfileFormChange}
                            />
                            <label htmlFor="notifications">Enable email notifications</label>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;