import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import Select from 'react-select';
import './ProfileSettings.css';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

const ProfileSettings = ({ userId, idToken, showSettings }) => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userRes = await fetch(`/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
      const userData = await userRes.json();
      setUser(userData);
    };

    fetchUser();
  }, [userId, idToken]);

  const handleDietaryRestrictionsChange = (selectedOptions) => {
    setDietaryRestrictions(selectedOptions.map((option) => option.value));
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Kosher', 'Halal', 'Pescatarian', 'Paleo', 'Keto']
                            .map((option) => ({ value: option.toLowerCase(), label: option }));

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 
    'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 
    'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
  ];

  const handlePasswordValidation = async (e) => {
    e.preventDefault();
    try {
      const validationRes = await fetch(`/api/users/${userId}/validate-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ password }),
      });
      const validationData = await validationRes.json();
      console.log(validationData);
      if (validationData.isValid) {
        // Perform update operation
        const updatedUser = {
          username: newUsername || user.username,
          password: newPassword || user.password,
          dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : user.dietaryRestrictions,
          city: city || user.city,
          state: state || user.state,
        };
        await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(updatedUser),
        });
        if (newPassword) {
          const auth = getAuth();
          signInWithEmailAndPassword(auth, user.email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              updatePassword(user, newPassword)
                .then(() => {
                  console.log('Password updated in Firebase');
                })
                .catch((error) => {
                  console.error('Error updating password in Firebase:', error);
                });
            })
            .catch((error) => {
              console.error('Error signing in with email and password:', error);
            });
        }
      } else {
        alert('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    <div className="settings-container">
      <form onSubmit={handlePasswordValidation} className="settings-form">
        <div className="section-title">General Info</div>
        <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Current Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
        <button type="submit" className="update-button">Update</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
