import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUserWithFirebase = async (email, password) => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered with Firebase:', userCredential);
      return true;
    } catch (error) {
      console.error('Error registering user with Firebase:', error);
      return false;
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password };
    const userCredential = await registerUserWithFirebase(email, password);
    if (userCredential) {
      const idToken = await userCredential.user.getIdToken();
      try {
        const response = await fetch('/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(newUser),
        });
        const savedUser = await response.json();
        console.log('User created:', savedUser);
        // Redirect to the login page or the desired authenticated page
      } catch (error) {
        console.error('Error creating user:', error);
      }
    } else {
      alert('Error registering user with Firebase');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
