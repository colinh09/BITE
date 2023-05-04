import React, { useState, useEffect, useCallback } from "react";
import Select from 'react-select';
import '../App.css';
const EditableLists = ({ userId, idToken }) => {
    const [wantsToTry, setWantsToTry] = useState([]);
    const [haveBeenTo, setHaveBeenTo] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [listType, setListType] = useState('');

    const apiUrl = process.env.REACT_APP_PUBLIC_URL || '';

    const listTypes = [
        { value: 'wants-to-try', label: 'Wants to Try' },
        { value: 'have-been-to', label: 'Have Been To' },
        { value: 'favorites', label: 'Favorites' },
    ];

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

    // useEffect(() => {
    //     fetchRestaurants();
    // }, []);

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

    const handleAddToList = (listType) => {
        if (selectedRestaurant) {
            addToList(listType, selectedRestaurant.value);
            setSelectedRestaurant(null);
        }
    };


    return (
        <div>
          <h1>Manage Your Lists</h1>
          <Select
            value={selectedRestaurant}
            onInputChange={handleInputChange}
            inputValue={searchInput}
            onChange={handleSelectChange}
            options={restaurants}
            isClearable
            placeholder="Select a restaurant"
          />
          <Select
            value={listTypes.find((option) => option.value === listType)}
            onChange={handleListTypeChange}
            options={listTypes}
            isClearable
            placeholder="Select a list"
          />
          <button onClick={() => handleAddToList(listType)} disabled={!listType || !selectedRestaurant}>
            Add to List
          </button>
          {[
        { title: 'Wants to Try', data: wantsToTry },
        { title: 'Have Been To', data: haveBeenTo },
        { title: 'Favorites', data: favorites }
      ].map((list) => (
        <div key={list.title}>
          <h1>{list.title}</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(list.data) ? (
                list.data.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.location}</td>
                    <td>
                      <button onClick={() => deleteFromList(list.title.toLowerCase().replace(/ /g, '-'), restaurant._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
      );
    };

export default EditableLists;
