import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/munchr.png';

const apiUrl = process.env.REACT_APP_PUBLIC_URL || '';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getUserByEmail = async (email, idToken) => {
    try {
      const response = await fetch(apiUrl + `api/users/by-email/${email}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const user = await response.json();
      console.log('User fetched by email:', user);
      return user;
    } catch (error) {
      console.error('Error fetching user by email:', error);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('idToken', idToken);
      const user = await getUserByEmail(email, idToken);
      localStorage.setItem('userId', user._id);
      window.location.href = '/lists';
    } catch (error) {
      alert('Invalid email or password');
    }
  };


  return (
    <div className="login-container">
      <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
      <form onSubmit={loginUser} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="username-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-field"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="register-link">
        Don't have an account? <Link to="/register" className="register-link-text">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
