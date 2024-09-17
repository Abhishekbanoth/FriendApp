import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Components/Auth';
import Navbar from './Components/Navbar';
import AllUsers from './Components/AllUsers';
import MyFriendsAndRequests from './Components/MyFriends';
import RecommendedFriends from './Components/Home';
// import ProtectedRoute from './Components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div>
                <Navbar/>
                <Routes>
                    {/* Route for the root path */}
                    <Route path="/" element={<Auth />} />
                    <Route path="/login" element={<Auth />} />
                <Route 
                        path="/users" 
                        element={<AllUsers />} 
                    />
                    <Route 
                        path="/myfriends" 
                        element={<MyFriendsAndRequests />} 
                    />
                    <Route 
                        path="/home" 
                        element={<RecommendedFriends />} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
