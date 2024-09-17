import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import usersImage from './images/users.png'; 
import additionalImage from './images/home2.png'; 
import profile from './images/profile.jpg'

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [usersPerPage, setUsersPerPage] = useState(0);
    const [sentRequests, setSentRequests] = useState([]); // Track sent friend requests
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleError = useCallback((err, message) => {
        setError(message);
        if (err.response?.status === 401) navigate('/login');
    }, [navigate]);

    const fetchAllUsers = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/friends/search', {
                params: { q: '' },
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(data);
        } catch (err) {
            handleError(err, 'Failed to fetch all users.');
        }
    }, [token, handleError]);

    const handleSendFriendRequest = async (userId) => {
        try {
            await axios.post(`http://localhost:5000/friends/add/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSentRequests([...sentRequests, userId]); // Add user to sent requests
        } catch (err) {
            handleError(err, 'Failed to send friend request.');
        }
    };

    const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const usersToShow = filteredUsers.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

    useEffect(() => {
        if (token) {
            fetchAllUsers();
        } else {
            navigate('/login');
        }
    }, [token, navigate, fetchAllUsers]);

    useEffect(() => {
        const updateUsersPerPage = () => {
            const imageHeight = 400; 
            const userItemHeight = 80; // Adjusted for larger user cards
            setUsersPerPage(Math.floor(imageHeight / userItemHeight));
        };

        updateUsersPerPage();
        window.addEventListener('resize', updateUsersPerPage);
        return () => window.removeEventListener('resize', updateUsersPerPage);
    }, []);

    const handleNextPage = () => {
        if ((currentPage + 1) * usersPerPage < filteredUsers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h2 style={styles.title}>All Registered Users</h2>
                {error && <p style={styles.error}>{error}</p>}

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name"
                    style={styles.input}
                />

                <ul style={styles.list}>
                    {usersToShow.length > 0 ? (
                        usersToShow.map((user) => (
                            <li key={user._id} style={styles.listItem}>
                                <img src={profile} alt="Avatar" style={styles.avatar} />
                                <div>
                                    <span style={styles.username}>{user.username}</span>
                                    {/* <p style={styles.bio}>{user.bio || "No bio available"}</p> */}
                                </div>
                                {sentRequests.includes(user._id) ? (
                                    <button disabled style={styles.buttonDisabled}>
                                        Request Sent
                                    </button>
                                ) : (
                                    <button onClick={() => handleSendFriendRequest(user._id)} style={styles.button}>
                                        Send Request
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <li style={styles.listItem}>No users found</li>
                    )}
                </ul>

                <div style={styles.pagination}>
                    <button
                        onClick={handlePreviousPage}
                        style={styles.paginationButton}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        style={styles.paginationButton}
                        disabled={(currentPage + 1) * usersPerPage >= filteredUsers.length}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div style={styles.imageWrapper}>
                <img src={usersImage} alt="Users" style={styles.image} />
                <img src={additionalImage} alt="Additional" style={styles.additionalImage} />
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
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        maxWidth: 'calc(50% - 20px)', // Adjust to ensure container and image take up similar space
    },
    imageWrapper: {
        flexShrink: 0,
        maxWidth: 'calc(50% - 20px)', // Adjust to ensure container and image take up similar space
        display: 'flex',
        flexDirection: 'column', // Stack images vertically
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px', // Space between images
    },
    additionalImage: {
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
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    username: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
    },
    bio: {
        fontSize: '14px',
        color: '#777',
        marginTop: '4px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '15px',
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
        '&:hover': {
            backgroundColor: '#0056b3',
            transform: 'scale(1.05)',
        },
    },
    buttonDisabled: {
        padding: '8px 16px',
        backgroundColor: '#ccc',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        fontSize: '14px',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    paginationButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        '&:disabled': {
            backgroundColor: '#ccc',
            cursor: 'not-allowed',
        },
    },
};

export default AllUsers;
