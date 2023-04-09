import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getUserByEmail = async (email, idToken) => {
    try {
      const response = await fetch(`api/users/by-email/${email}`, {
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
      const user = await getUserByEmail(email, idToken); // Pass idToken here
      localStorage.setItem('userId', user._id);
      // Redirect to the Lists page
      window.location.href = '/lists';
    } catch (error) {
      alert('Invalid email or password');
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={loginUser}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
