import React, { useState } from "react";

// change 1 -> Environment variable name in React must start with REACT_APP_
const openCageApiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
console.log("What is the api key : ",openCageApiKey);

const Track = () => {
  // change 2 -> Added state for source and destination selection
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");

  const ukCities = [
    "London",
    "Manchester",
    "Birmingham",
    "Leeds",
    "Liverpool",
    "Sheffield",
    "Bristol",
    "Nottingham",
    "Leicester",
    "Newcastle upon Tyne",
    "Sunderland",
    "Stoke-on-Trent",
    "Derby",
    "Southampton",
    "Portsmouth",
    "Reading",
    "Brighton",
    "Milton Keynes",
    "Northampton",
    "Cambridge",
    "Oxford",
    "York",
    "Hull",
    "Coventry",
    "Bradford",
    "Luton",
    "Wolverhampton",
    "Preston",
    "Blackpool",
    "Middlesbrough",
    "Chester",
    "Exeter",
    "Plymouth",
    "Norwich",
    "Peterborough",
    "Swansea",
    "Cardiff",
    "Newport",
    "Bath",
    "Cheltenham",
  ];

  // change 3 -> Corrected async function syntax
  const Geocoding = async () => {
    if (!src || !dest) {
      alert("Please select both source and destination.");
      return;
    }
    console.log(src);
    console.log(dest);

    try {
      // change 4 -> Corrected template literals and await usage
      const responseForSrc = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${src}&key=${openCageApiKey}`
        // `https://api.opencagedata.com/geocode/v1/json?q=Frauenplan+1%2C+99423+Weimar%2C+Germany&key=${openCageApiKey}`
      );
      const srcData = await responseForSrc.json();

      const responseForDest = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${dest}&key=${openCageApiKey}`
      );
      const destData = await responseForDest.json();

      // change 5 -> Extract and set latitude & longitude properly
      const srcCoords = srcData.results[0]?.geometry;
      const destCoords = destData.results[0]?.geometry;

      console.log("Source:", srcCoords);
      console.log("Destination:", destCoords);

      setLatitude(srcCoords?.lat || 0);
      setLongitude(srcCoords?.lng || 0);
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] sm:w-[400px]">
        <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-6">
          Track Your Path
        </h2>

        <div className="flex flex-col gap-5">
          {/* Source */}
          <div className="flex flex-col">
            <label htmlFor="source" className="text-gray-700 font-medium mb-2">
              Enter the Source:
            </label>
            <select
              id="source"
              value={src}
              onChange={(e) => setSrc(e.target.value)} // change 6 -> added onChange
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Source</option>
              {ukCities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="flex flex-col">
            <label
              htmlFor="destination"
              className="text-gray-700 font-medium mb-2"
            >
              Enter the Destination:
            </label>
            <select
              id="destination"
              value={dest}
              onChange={(e) => setDest(e.target.value)} // change 7 -> added onChange
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
        </div>

        {/* Track Button */}
        <div className="flex justify-center mt-8">
          {/* change 8 -> fixed onClick syntax to call function properly */}
          <button
            onClick={Geocoding}
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
