import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {users.length > 0 ? (
        <div>
          {users.map(user => (
            <div key={user._id}>
              <p>Name: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Password: {user.password}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default App;