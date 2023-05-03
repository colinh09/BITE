import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Select from 'react-select';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const registerUserWithFirebase = async (email, password) => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered with Firebase:', userCredential);
      return userCredential;
    } catch (error) {
      console.error('Error registering user with Firebase:', error);
      return null;
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password, dietaryRestrictions, city, state };
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

  const handleDietaryRestrictionsChange = (selectedOptions) => {
    setDietaryRestrictions(selectedOptions.map((option) => option.value));
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Kosher', 'Halal', 'Pescatarian', 'Paleo', 'Keto']
                            .map((option) => ({ value: option.toLowerCase(), label: option }));

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
  ];
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
        <Select
          isMulti
          options={dietaryOptions}
          value={dietaryRestrictions.map((restriction) => ({
            value: restriction,
            label: restriction.charAt(0).toUpperCase() + restriction.slice(1),
          }))}
          onChange={handleDietaryRestrictionsChange}
        />
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city.toLowerCase()}>{city}</option>
          ))}
        </select>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Select State</option>
          {usStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;