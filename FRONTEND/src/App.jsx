import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import History from './pages/History';
import Settings from './pages/Settings';
import './App.css';

function App() {
    const { isAuthenticated } = useContext(AuthContext);

    // Protected route component
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/auth" />;
        }
        return children;
    };

    return (
        <div className="app">
            {isAuthenticated && <Navbar />}
            <main className="content">
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/devices" element={
                        <ProtectedRoute>
                            <DeviceList />
                        </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;