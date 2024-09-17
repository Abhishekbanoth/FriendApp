import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div style={{ marginBottom: "56px" }}>
            <nav className="navbar navbar-dark bg-dark fixed-top navbar-expand-lg">
                <Link className="navbar-brand ml-3" to="/home">Friend-App</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto" style={{marginRight:"560px"}}>
                        <li className="nav-item">
                            <Link className="btn btn-dark" to="/home">Home</Link>
                        </li>
                        <li className="nav-item mx-3">
                            <Link className="btn btn-dark" to="/users">Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-dark" to="/myfriends">Friends</Link>
                        </li>
                    </ul>
                    <li className="nav-item mr-3">
                            <Link className="btn btn-dark" to="/login">Logout</Link>
                        </li>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
