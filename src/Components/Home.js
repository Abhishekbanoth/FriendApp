import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import home from './images/home.png'; // Update the path to your image

const RecommendedFriends = () => {
    const [recommendedFriends, setRecommendedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleError = useCallback((err, message) => {
        setError(message);
        if (err.response?.status === 401) navigate('/login');
    }, [navigate]);

    const fetchRecommendations = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/friends/recommendations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendedFriends(data);
        } catch (err) {
            handleError(err, 'Failed to fetch recommendations.');
        }
    }, [token, handleError]);

    useEffect(() => {
        if (token) {
            fetchRecommendations();
        } else {
            navigate('/login');
        }
    }, [token, navigate, fetchRecommendations]);

    const handleAddFriend = async (friendId) => {
        try {
            await axios.post(`http://localhost:5000/friends/add/${friendId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendedFriends((prev) => prev.filter((friend) => friend._id !== friendId));
        } catch (err) {
            handleError(err, 'Failed to add friend.');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredFriends = recommendedFriends.filter((friend) =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h2 style={styles.title}>Connect with New Friends</h2>
                {error && <p style={styles.error}>{error}</p>}
                
                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search friends..." 
                    value={searchTerm} 
                    onChange={handleSearch} 
                    style={styles.searchInput}
                />
                
                <ul style={styles.list}>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend) => (
                            <li key={friend._id} style={styles.listItem}>
                                <span style={styles.username}>{friend.username}</span>
                                <div style={styles.actions}>
                                    <button onClick={() => handleAddFriend(friend._id)} style={styles.button}>Add Friend</button>
                                    
                                </div>
                            </li>
                        ))
                    ) : (
                        <li style={styles.listItem}>No recommendations available</li>
                    )}
                </ul>

                {/* Friend Stats */}
                <div style={styles.stats}>
                    <h3 style={styles.statsTitle}>Friend Stats</h3>
                    <p><strong>Total Friends:</strong> {recommendedFriends.length}</p>
                    <p><strong>Mutual Connections:</strong> 10</p> {/* Static example */}
                    <p><strong>New Friends this Month:</strong> 5</p> {/* Static example */}
                </div>
            </div>
            <div style={styles.imageWrapper}>
                <img src={home} alt="Friendship" style={styles.image} />
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgb(0 103 255 / 25%)',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    container: {
        flex: 1,
        height:'70vh',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        maxWidth: 'calc(50% - 20px)',
    },
    imageWrapper: {
        flexShrink: 0,
        maxWidth: 'calc(50% - 20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
    },
    error: {
        color: '#dc3545',
        fontSize: '16px',
        marginBottom: '20px',
    },
    searchInput: {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        borderBottom: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    username: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s, transform 0.2s',
    },
    stats: {
        marginTop: '20px',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
    },
    statsTitle: {
        fontSize: '22px',
        color: '#007bff',
        marginBottom: '10px',
    },
};

export default RecommendedFriends;
