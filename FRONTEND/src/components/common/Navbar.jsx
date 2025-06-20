import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>IoT Dashboard</h1>
            </div>
            <ul className="navbar-nav">
                <li className={`nav-item ${isActive('/')}`}>
                    <Link to="/" className="nav-link">Dashboard</Link>
                </li>
                <li className={`nav-item ${isActive('/devices')}`}>
                    <Link to="/devices" className="nav-link">Devices</Link>
                </li>
                <li className={`nav-item ${isActive('/history')}`}>
                    <Link to="/history" className="nav-link">History</Link>
                </li>
                <li className={`nav-item ${isActive('/settings')}`}>
                    <Link to="/settings" className="nav-link">Settings</Link>
                </li>
            </ul>
            <div className="navbar-user">
                <span className="user-name">{user?.name || 'User'}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;