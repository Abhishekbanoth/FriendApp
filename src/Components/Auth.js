import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? '/auth/login' : '/auth/signup';
        try {
            const res = await axios.post(`http://localhost:5000${url}`, formData);
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (err) {
            console.error('Request failed:', err.response?.data || err.message);
            alert(`Error: ${err.response?.data.message || err.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.submitButton}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
                {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'rgb(0 103 255 / 25%)',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        margin: '0 auto',
        height: 'auto',
        color: '#fff',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '15px',
        margin: '10px 0',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        outline: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    submitButton: {
        padding: '15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    submitButtonHover: {
        backgroundColor: '#0056b3',
    },
    toggleButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'black',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '14px',
        marginTop: '10px',
        transition: 'color 0.3s ease',
    },
    toggleButtonHover: {
        color: '#fff',
    },
};

export default Auth;
