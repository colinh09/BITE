import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import styles from "./MapPage.css";

function MapPage() {
  const [wantsToTry, setWantsToTry] = useState([]);
  const [haveBeenTo, setHaveBeenTo] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem("userId");
  const idToken = localStorage.getItem("idToken");

  const apiUrl = process.env.REACT_APP_PUBLIC_URL || '';

  useEffect(() => {
    if (userId) {
      fetchLists(userId, idToken);
    } else {
      console.log("User is not logged in");
    }

    async function fetchLists(userId, idToken) {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        };

        const wantsToTryRes = await fetch(apiUrl + `/api/users/${userId}/wants-to-try`, requestOptions);
        const wantsToTryData = await wantsToTryRes.json();
        if (wantsToTryData) setWantsToTry(wantsToTryData);

        const haveBeenToRes = await fetch(apiUrl + `/api/users/${userId}/have-been-to`, requestOptions);
        const haveBeenToData = await haveBeenToRes.json();
        if (haveBeenToData) setHaveBeenTo(haveBeenToData);

        const favoritesRes = await fetch(apiUrl + `/api/users/${userId}/favorites`, requestOptions);
        const favoritesData = await favoritesRes.json();
        if (favoritesData) setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    }
  }, [userId, idToken]);

  return (
    <div className={styles.MapPage}>
      <Map wantsToTry={wantsToTry} haveBeenTo={haveBeenTo} favorites={favorites} />
    </div>
  );
}

export default MapPage;
