import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import usersImage from './images/users.png';
import additionalImage from './images/home2.png';
import profile from './images/profile.jpg';

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [usersPerPage, setUsersPerPage] = useState(0);
    const [sentRequests, setSentRequests] = useState([]);
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
            setSentRequests([...sentRequests, userId]);
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
            const userItemHeight = 80;
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
        <div className="wrapper">
            <style>{`
                .wrapper {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                    background-color: rgb(0 103 255 / 25%);
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .container {
                    flex: 1;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                    max-width: calc(50% - 20px);
                }
                .imageWrapper {
                    flex-shrink: 0;
                    max-width: calc(50% - 20px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .image, .additionalImage {
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                }
                .title {
                    font-size: 28px;
                    margin-bottom: 20px;
                    color: #333;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 10px;
                }
                .error {
                    color: #dc3545;
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                .list {
                    list-style-type: none;
                    padding: 0;
                }
                .listItem {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    background-color: rgb(255 255 255 / 69%);
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .username {
                    font-size: 18px;
                    font-weight: 500;
                    color: #333;
                }
                .avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 15px;
                }
                .button {
                    padding: 8px 16px;
                    background-color: #007bff;
                    color: #ffffff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s, transform 0.2s;
                }
                .button:hover {
                    background-color: #0056b3;
                    transform: scale(1.05);
                }
                .buttonDisabled {
                    padding: 8px 16px;
                    background-color: #ccc;
                    color: #ffffff;
                    border: none;
                    border-radius: 4px;
                    cursor: not-allowed;
                    font-size: 14px;
                }
                .pagination {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .paginationButton {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .paginationButton:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                /* Media Queries */
                @media (max-width: 768px) {
                    .wrapper {
                        flex-direction: column;
                        padding: 20px;
                    }
                    .container, .imageWrapper {
                        max-width: 100%;
                        margin-bottom: 20px;
                    }
                    .listItem {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .button {
                        width: 100%;
                        margin-top: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .title {
                        font-size: 24px;
                    }
                    .avatar {
                        width: 40px;
                        height: 40px;
                    }
                    .username {
                        font-size: 16px;
                    }
                    .button {
                        padding: 6px 12px;
                        font-size: 12px;
                    }
                }
            `}</style>

            <div className="container">
                <h2 className="title">All Registered Users</h2>
                {error && <p className="error">{error}</p>}

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name"
                    className="input"
                />

                <ul className="list">
                    {usersToShow.length > 0 ? (
                        usersToShow.map((user) => (
                            <li key={user._id} className="listItem">
                                <img src={profile} alt="Avatar" className="avatar" />
                                <div>
                                    <span className="username">{user.username}</span>
                                </div>
                                {sentRequests.includes(user._id) ? (
                                    <button disabled className="buttonDisabled">
                                        Request Sent
                                    </button>
                                ) : (
                                    <button onClick={() => handleSendFriendRequest(user._id)} className="button">
                                        Send Request
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                </ul>

                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 0} className="paginationButton">
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={(currentPage + 1) * usersPerPage >= filteredUsers.length}
                        className="paginationButton"
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="imageWrapper">
                <img src={usersImage} alt="All Users" className="image" />
                <img src={additionalImage} alt="Additional Info" className="additionalImage" />
            </div>
        </div>
    );
};

export default AllUsers;
