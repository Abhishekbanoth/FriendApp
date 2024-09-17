import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import friendsImage from './images/friends.png'; // Path to your first image
import defaultAvatar from './images/profile.jpg'; // Fallback image for users without a profile picture

const MyFriendsAndRequests = () => {
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleError = useCallback((err, message) => {
        setError(message);
        if (err.response?.status === 401) navigate('/login');
    }, [navigate]);

    const fetchFriends = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/friends', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriends(data);
        } catch (err) {
            handleError(err, 'Failed to fetch friends.');
        }
    }, [token, handleError]);

    const fetchFriendRequests = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/friends/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendRequests(data);
        } catch (err) {
            handleError(err, 'Failed to fetch friend requests.');
        }
    }, [token, handleError]);

    useEffect(() => {
        if (token) {
            fetchFriends();
            fetchFriendRequests();
        } else {
            navigate('/login');
        }
    }, [token, navigate, fetchFriends, fetchFriendRequests]);

    const handleUnfriend = async (friendId) => {
        try {
            await axios.post(`http://localhost:5000/friends/unfriend/${friendId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
        } catch (err) {
            handleError(err, 'Failed to unfriend.');
        }
    };

    const handleRequest = async (requestId, accept) => {
        try {
            await axios.post(`http://localhost:5000/friends/requests/${requestId}`, { accept }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendRequests((prev) => prev.filter((request) => request._id !== requestId));
            if (accept) {
                fetchFriends(); // Refresh friends list after accepting a request
            }
        } catch (err) {
            handleError(err, 'Failed to handle friend request.');
        }
    };

    const filteredFriends = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.wrapper}>
            <div style={styles.row}>
                <div style={styles.friendsContainer}>
                    <h2 style={styles.title}>Your Friends</h2>
                    {error && <p style={styles.error}>{error}</p>}

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search friends by name"
                        style={styles.input}
                    />

                    <ul style={styles.list}>
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <li key={friend._id} style={styles.listItem}>
                                    <img
                                        src={friend.profileImage || defaultAvatar}
                                        alt={friend.username}
                                        style={styles.avatar}
                                    />
                                    <span style={styles.username}>{friend.username}</span>
                                    <button onClick={() => handleUnfriend(friend._id)} style={styles.button}>Unfriend</button>
                                </li>
                            ))
                        ) : (
                            <li style={styles.listItem}>No friends found</li>
                        )}
                    </ul>
                </div>

                <div style={styles.imageContainer}>
                    <img src={friendsImage} alt="Friends" style={styles.image} />
                </div>
            </div>

            <div style={styles.requestsContainer}>
                <h3 style={styles.title}>Friend Requests</h3>
                <ul style={styles.list}>
                    {friendRequests.length > 0 ? (
                        friendRequests.map((request) => (
                            <li key={request._id} style={styles.listItem}>
                                <img
                                    src={request.profileImage || defaultAvatar}
                                    alt={request.username}
                                    style={styles.avatar}
                                />
                                <span style={styles.username}>{request.username}</span>
                                <div style={styles.requestActions}>
                                    <button onClick={() => handleRequest(request._id, true)} style={styles.acceptButton}>Accept</button>
                                    <button onClick={() => handleRequest(request._id, false)} style={styles.rejectButton}>Reject</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li style={styles.listItem}>No friend requests</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgb(0 103 255 / 25%)',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    friendsContainer: {
        flex: 1,
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginRight: '20px',
    },
    imageContainer: {
        flex: 1,
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
    requestsContainer: {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '26px',
        marginBottom: '20px',
        color: '#333',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        fontWeight: '600',
    },
    error: {
        color: '#dc3545',
        fontSize: '16px',
        marginBottom: '20px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        outline: 'none',
        transition: 'border-color 0.3s',
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
        borderBottom: '1px solid #eee',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: 'rgb(255 255 255 / 69%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    username: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s, transform 0.2s',
    },
    requestActions: {
        display: 'flex',
        gap: '10px',
    },
    acceptButton: {
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s, transform 0.2s',
    },
    rejectButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s, transform 0.2s',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '0px',
    },
};

export default MyFriendsAndRequests;


