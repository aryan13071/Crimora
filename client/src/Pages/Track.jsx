import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const openCageApiKey = process.env.REACT_APP_OPENCAGE_API_KEY;

const Track = () => {
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");
  const [srcCoords, setSrcCoords] = useState(null);
  const navigate = useNavigate();

  const ukCities = [
    "London", "Manchester", "Birmingham", "Leeds", "Liverpool",
    "Sheffield", "Bristol", "Nottingham", "Leicester", "Newcastle upon Tyne",
    "Cardiff", "Swansea", "Oxford", "Cambridge"
  ];

  // Fetch user’s current location
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSrc("My Current Location");
        setSrcCoords(coords);
      },
      (error) => {
        alert("Unable to fetch your location.");
        console.error(error);
      }
    );
  };

  const handleTrack = async () => {
    if ((!src && !srcCoords) || !dest) {
      alert("Please select both source and destination.");
      return;
    }

    try {
      let srcC = srcCoords;

      // Only fetch if not using current location
      if (!srcCoords) {
        const res1 = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${src}&key=${openCageApiKey}`
        );
        const data1 = await res1.json();
        srcC = data1.results[0]?.geometry;
      }

      const res2 = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${dest}&key=${openCageApiKey}`
      );
      const data2 = await res2.json();
      const destC = data2.results[0]?.geometry;

      if (!srcC || !destC) {
        alert("Couldn't get coordinates for one of the locations.");
        return;
      }

      navigate("/map", { state: { srcCoords: srcC, destCoords: destC } });
    } catch (err) {
      console.error(err);
      alert("Error fetching location data.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] sm:w-[400px]">
        <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-6">
          Track Your Path
        </h2>

        {/* Source Input */}
        <div className="flex flex-col mb-4">
          <label htmlFor="source" className="text-gray-700 font-medium mb-2">
            Enter the Source:
          </label>
          <select
            id="source"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Source</option>
            {ukCities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Use My Location button */}
          <button
            onClick={useMyLocation}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Use My Current Location
          </button>
        </div>

        {/* Destination Input */}
        <div className="flex flex-col mb-6">
          <label htmlFor="destination" className="text-gray-700 font-medium mb-2">
            Enter the Destination:
          </label>
          <select
            id="destination"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Destination</option>
            {ukCities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Track Button */}
        <div className="flex justify-center">
          <button
            onClick={handleTrack}
            className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
};

export default Track;
