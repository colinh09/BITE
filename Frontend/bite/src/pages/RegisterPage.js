import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Select from 'react-select';
import './RegisterPage.css';
import logo from '../assets/munchr.png';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

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
        const response = await fetch(apiUrl + 'api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(newUser),
        });
        const savedUser = await response.json();
        console.log('User created:', savedUser);
        navigate('/');
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

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#F3684A' : '#F3684A',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(243,104,74,0.5)' : '',
      '&:hover': {
        borderColor: '#F3684A',
      },
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: '#F3684A',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: '#FFFFFF',
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#F3684A',
        color: '#FFFFFF',
      },
    }),
  };

  return (
    <div className="register-container">
      <div className="logo" style={{ backgroundImage: `url(${logo})` }}></div>
      <form onSubmit={createUser} className="register-form">
        <div className="section-title">General Info</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <div className="section-title">Flavor Profile</div>
      <Select
        isMulti
        options={dietaryOptions}
        value={dietaryRestrictions.map((restriction) => ({
          value: restriction,
          label: restriction.charAt(0).toUpperCase() + restriction.slice(1),
        }))}
        onChange={handleDietaryRestrictionsChange}
        className="select-field"
        styles={customSelectStyles}
        placeholder="Select Your Dietary Restrictions"
      />
      <select value={city} onChange={(e) => setCity(e.target.value)} className="input-field">
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city.toLowerCase()}>{city}</option>
        ))}
      </select>
      <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
        <option value="">Select State</option>
        {usStates.map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      <button type="submit" className="register-button">Register</button>
    </form>
    <p className="login-link">
      Already have an account? <Link to="/" className="login-link-text">Login</Link>
    </p>
  </div>
  );
};

export default RegisterPage;