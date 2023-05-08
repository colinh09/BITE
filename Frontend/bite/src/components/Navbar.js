import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/munchr_logo_white.png';
import { getAuth, signOut } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            localStorage.removeItem('idToken');
            localStorage.removeItem('userId');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="navbar">
        <div className="navbar-logo" style={{ backgroundImage: `url(${logo})` }}></div>
        <ul className="navbar-links">
            <li>
            <NavLink
                to="/home"
                className={`navbar-link ${isActive('/home') ? 'active-link' : ''}`}
            >
                Home
            </NavLink>
            </li>
            <li>
            <NavLink
                to="/explore"
                className={`navbar-link ${isActive('/explore') ? 'active-link' : ''}`}
            >
                Explore
            </NavLink>
            </li>
            <li>
            <NavLink
                to="/lists"
                className={`navbar-link ${isActive('/lists') ? 'active-link' : ''}`}
            >
                Lists
            </NavLink>
            </li>
            <li>
            <NavLink
                to="/tasteprofile"
                className={`navbar-link ${isActive('/tasteprofile') ? 'active-link' : ''}`}
            >
                Taste Profile
            </NavLink>
            </li>
        </ul>
        <div className="logout-container">
            <button
                onClick={logout}
                className={`navbar-link logout-button ${isActive('/logout') ? 'active-link' : ''}`}
            >
                Logout
            </button>
        </div>
        </nav>
    );
};

export default Navbar;
