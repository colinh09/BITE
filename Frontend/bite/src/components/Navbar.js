import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUnorderedList, AiOutlineSmile, AiOutlineLogout } from 'react-icons/ai'; // Importing icons
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
                        <AiOutlineHome className="navbar-icon" /> Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/explore"
                        className={`navbar-link ${isActive('/explore') ? 'active-link' : ''}`}
                    >
                        <AiOutlineSearch className="navbar-icon" /> Explore
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/lists"
                        className={`navbar-link ${isActive('/lists') ? 'active-link' : ''}`}
                    >
                        <AiOutlineUnorderedList className="navbar-icon" /> Lists
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/tasteprofile"
                        className={`navbar-link ${isActive('/tasteprofile') ? 'active-link' : ''}`}
                    >
                        <AiOutlineSmile className="navbar-icon" /> Taste Profile
                    </NavLink>
                </li>
            </ul>
            <div className="logout-container">
                <button
                    onClick={logout}
                    className={`navbar-link ${isActive('/logout') ? 'active-link' : ''}`}
                >
                    <AiOutlineLogout className="navbar-icon" /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
