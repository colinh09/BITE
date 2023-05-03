import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/munchr.png';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
      return location.pathname === path;
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
        </nav>
    );
};

export default Navbar;
