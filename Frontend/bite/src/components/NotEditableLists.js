import React, { useState, useEffect } from "react";
import "../App.css";
import "./NotEditableLists.css";
import { MdClose } from "react-icons/md";

const NotEditableLists = ({ userId, idToken, onClose }) => {
  const [wantsToTry, setWantsToTry] = useState([]);
  const [haveBeenTo, setHaveBeenTo] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const apiUrl = process.env.REACT_APP_PUBLIC_URL || "http://localhost:5000/";
  const [activeTab, setActiveTab] = useState("wants-to-try");
  const [username, setUsername] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchUsername = async () => {
    try {
      const response = await fetch(apiUrl + `api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchLists();
    fetchUsername();
  }, [userId, idToken]);

  const fetchLists = async () => {
    try {
      const wantsToTryRes = await fetch(apiUrl + `api/users/${userId}/wants-to-try`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const wantsToTryData = await wantsToTryRes.json();
      setWantsToTry(wantsToTryData);

      const haveBeenToRes = await fetch(apiUrl + `api/users/${userId}/have-been-to`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const haveBeenToData = await haveBeenToRes.json();
      setHaveBeenTo(haveBeenToData);

      const favoritesRes = await fetch(apiUrl + `api/users/${userId}/favorites`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const favoritesData = await favoritesRes.json();
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [userId, idToken]);

  const renderList = (listData) => {
    return (
      <table className="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(listData)
            ? listData.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <button className="close-button" onClick={onClose}>
        <MdClose size={24} color="#F3684A" />
      </button>
      <div className="not-editable-lists-header">
        <h1>View {username}'s Lists</h1>
      </div>
      <div className="tab-buttons">
        <button
          className={`tab-button ${
            activeTab === "wants-to-try" ? "tab-button-selected" : ""
          }`}
          onClick={() => handleTabClick("wants-to-try")}
        >
          Wants to Try
        </button>
        <button
          className={`tab-button ${
            activeTab === "have-been-to" ? "tab-button-selected" : ""
          }`}
          onClick={() => handleTabClick("have-been-to")}
        >
          Have Been To
        </button>
        <button
          className={`tab-button ${
            activeTab === "favorites" ? "tab-button-selected" : ""
          }`}
          onClick={() => handleTabClick("favorites")}
        >
          Favorites
        </button>
      </div>
      {activeTab === "wants-to-try" && (        <div>
          <h2>Wants to Try</h2>
          <div className="list-table-container">{renderList(wantsToTry)}</div>
        </div>
      )}
      {activeTab === "have-been-to" && (
        <div>
          <h2>Have Been To</h2>
          <div className="list-table-container">{renderList(haveBeenTo)}</div>
        </div>
      )}
      {activeTab === "favorites" && (
        <div>
          <h2>Favorites</h2>
          <div className="list-table-container">{renderList(favorites)}</div>
        </div>
      )}
    </div>
  );
};

export default NotEditableLists;
