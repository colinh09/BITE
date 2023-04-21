import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function MapPage() {
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchRestaurants(user);
      } else {
        console.log("User is not logged in");
      }
    });

    async function fetchRestaurants(user) {
      try {
        const idToken = await user.getIdToken(true);

        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        };

        const response = await fetch("/api/restaurants", requestOptions);
        const data = await response.json();
        setRestaurantData(data.slice(0, 2));

        setRestaurantData(data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="Map Page">
      <Map restaurants={restaurantData} />
    </div>
  );
}

export default MapPage;
