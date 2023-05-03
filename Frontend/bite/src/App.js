import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersLists from './pages/UserLists';
import MapPage from './pages/MapPage';
import TasteProfile from './pages/TasteProfile';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarWrapper />
        <div className="main-container">
          <div className="content-container">
            <Routes>
              <Route path="/lists" element={<UsersLists />} />
              <Route path="/explore" element={<MapPage />} />
              <Route path="/tasteprofile" element={<TasteProfile />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </div>
        </div>
        <div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const NavbarWrapper = () => {
  const location = useLocation();
  const excludedRoutes = ['/', '/register'];

  if (excludedRoutes.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
};

export default App;
