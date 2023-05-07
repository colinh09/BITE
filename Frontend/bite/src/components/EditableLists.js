import React, { useState, useEffect, useCallback } from "react";
import Select from 'react-select';
import '../App.css';
import "./EditableLists.css"; 

const EditableLists = ({ userId, idToken }) => {
    const [wantsToTry, setWantsToTry] = useState([]);
    const [haveBeenTo, setHaveBeenTo] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [listType, setListType] = useState('');
    const [activeTab, setActiveTab] = useState('wants-to-try');

    const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

    const listTypes = [
        { value: 'wants-to-try', label: 'Wants to Try' },
        { value: 'have-been-to', label: 'Have Been To' },
        { value: 'favorites', label: 'Favorites' },
    ];

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };    

    const fetchLists = async () => {
        try {
            const wantsToTryRes = await fetch(apiUrl + `api/users/${userId}/wants-to-try`, {
                headers: {
                Authorization: `Bearer ${idToken}`,
                },
            });
            const wantsToTryData = await wantsToTryRes.json();
            console.log(wantsToTryData);
            setWantsToTry(wantsToTryData);

            const haveBeenToRes = await fetch(apiUrl + `api/users/${userId}/have-been-to`, {
                headers: {
                Authorization: `Bearer ${idToken}`,
                },
            });
            const haveBeenToData = await haveBeenToRes.json();
            setHaveBeenTo(haveBeenToData);
          } catch (error) {
              console.error("Error fetching lists:", error);
          }
          const favoritesRes = await fetch(apiUrl + `api/users/${userId}/favorites`, {
              headers: {
              Authorization: `Bearer ${idToken}`,
              },
          });
          const favoritesData = await favoritesRes.json();
          setFavorites(favoritesData);
    };

    const fetchFilteredRestaurants = useCallback(async (inputValue) => {
        try {
          const res = await fetch(apiUrl + `api/restaurants/search?q=${encodeURIComponent(inputValue)}`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          const responseData = await res.json();
          const restaurantData = responseData.data;
      
          if (Array.isArray(restaurantData)) {
            setRestaurants(
              restaurantData.map((restaurant) => ({
                value: restaurant._id,
                label: restaurant.name,
              })),
            );
          } else {
            console.error('Unexpected data format:', responseData);
            setRestaurants([]);
          }
        } catch (error) {
          console.error('Error fetching restaurants:', error);
        }
    }, [idToken]);

    const addToList = async (listType, restaurantId) => {
      try {
        console.log(restaurantId);
        await fetch(apiUrl + `api/users/${userId}/${listType}/add`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ restaurantId }),
        });
        fetchLists();
      } catch (error) {
        console.error(`Error adding restaurant to ${listType}:`, error);
      }
    };
    
  
    const deleteFromList = async (listType, restaurantId) => {
        try {
            await fetch(apiUrl + `api/users/${userId}/${listType}/delete`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ restaurantId }),
            });
            fetchLists();
        } catch (error) {
            console.error(`Error deleting restaurant from ${listType}:`, error);
        }
    };

    useEffect(() => {
        fetchLists();
    }, [userId, idToken]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchInput) {
                fetchFilteredRestaurants(searchInput);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchInput, fetchFilteredRestaurants]);

    const handleInputChange = (inputValue) => {
        setSearchInput(inputValue);
    };

    
    const handleListTypeChange = (selectedOption) => {
        setListType(selectedOption.value);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedRestaurant(selectedOption);
    };

    const handleAddToList = () => {
      if (selectedRestaurant) {
        addToList(activeTab, selectedRestaurant.value);
        setSelectedRestaurant(null);
      }
    };

    const renderList = (listData) => {
      console.log('Rendered list data:', listData);

      return (
        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Remove Restaurant</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(listData)
              ? listData.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.location}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteFromList(activeTab, restaurant._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      );
    };
      

    return (
      <div className="container">
        <h1>Manage Your Lists</h1>
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
        <div className="list-container">
        <Select
          className="search-box"
          options={restaurants}
          value={selectedRestaurant}
          onChange={handleSelectChange}
          onInputChange={handleInputChange}
          noOptionsMessage={() => "No restaurants found"}
          placeholder="Search for restaurants"
          isLoading={searchInput && restaurants.length === 0}
        />
        <button
          className="add-to-list-button"
          onClick={handleAddToList}
          disabled={!selectedRestaurant}
        >
          Add to List
        </button>
        </div>
        {activeTab === "wants-to-try" && (
          <div>
            <h2>Wants to Try</h2>
            <div className="list-table-container">
              {renderList(wantsToTry)}
            </div>
          </div>
        )}
        {activeTab === "have-been-to" && (
          <div>
            <h2>Have Been To</h2>
            <div className="list-table-container">
              {renderList(haveBeenTo)}
            </div>
          </div>
        )}
        {activeTab === "favorites" && (
          <div>
            <h2>Favorites</h2>
            <div className="list-table-container">
              {renderList(favorites)}
            </div>
          </div>
        )}
      </div>
    );
  };

export default EditableLists;
