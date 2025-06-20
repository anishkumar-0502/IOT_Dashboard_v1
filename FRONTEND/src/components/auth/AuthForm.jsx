import React, { useState } from 'react';

const AuthForm = ({ onSubmit, isLogin, toggleAuthMode }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                    />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="submit-btn">
                {isLogin ? 'Login' : 'Register'}
            </button>

            <p className="auth-toggle">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    type="button"
                    className="toggle-btn"
                    onClick={toggleAuthMode}
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </p>
        </form>
    );
};

export default AuthForm;