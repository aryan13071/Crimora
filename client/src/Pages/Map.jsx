import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import srcMarker from "../Assets/Source.png";
import destMarker from "../Assets/Destination.png";

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const routingRef = useRef(null);
  const { srcCoords, destCoords } = location.state || {};

  // -----------------------------
  // Custom Source/Destination icons
  // -----------------------------
  const srcIcon = L.icon({
    iconUrl: srcMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const destIcon = L.icon({
    iconUrl: destMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // -----------------------------
  // Fallback crime icons (if needed)
  // -----------------------------
  const crimeIcons = {
    "anti-social-behaviour": L.icon({ iconUrl: "path/to/antisocial.png", iconSize: [25, 25], iconAnchor: [12, 25] }),
    "burglary": L.icon({ iconUrl: "path/to/burglary.png", iconSize: [25, 25], iconAnchor: [12, 25] }),
    "violent-crime": L.icon({ iconUrl: "path/to/violent.png", iconSize: [25, 25], iconAnchor: [12, 25] }),
    "drugs": L.icon({ iconUrl: "path/to/drugs.png", iconSize: [25, 25], iconAnchor: [12, 25] }),
    "theft": L.icon({ iconUrl: "path/to/theft.png", iconSize: [25, 25], iconAnchor: [12, 25] }),
    "default": L.icon({ iconUrl: "path/to/default.png", iconSize: [25, 25], iconAnchor: [12, 25] }),
  };

  useEffect(() => {
    if (!srcCoords || !destCoords) {
      alert("Missing location data. Redirecting...");
      navigate("/");
      return;
    }

    // -----------------------------
    // Initialize map only once
    // -----------------------------
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // Remove previous routing control if exists
    if (routingRef.current) mapRef.current.removeControl(routingRef.current);

    // -----------------------------
    // Add routing from source → destination
    // -----------------------------
    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(srcCoords.lat, srcCoords.lng), L.latLng(destCoords.lat, destCoords.lng)],
      routeWhileDragging: false,
      lineOptions: { styles: [{ color: "green", weight: 6 }] },
      createMarker: (i, wp) => {
        const icon = i === 0 ? srcIcon : destIcon;
        const label = i === 0 ? "📍 Source" : "🏁 Destination";
        return L.marker(wp.latLng, { icon }).addTo(mapRef.current).bindPopup(label).openPopup();
      },
      addWaypoints: false,
      draggableWaypoints: false,
    }).addTo(mapRef.current);

    // Fit map bounds to show both points
    const bounds = L.latLngBounds([srcCoords.lat, srcCoords.lng], [destCoords.lat, destCoords.lng]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

    // -----------------------------
    // Generate intermediate points along route
    // -----------------------------
    const generateIntermediatePoints = (src, dest, count) => {
      const points = [];
      for (let i = 1; i <= count; i++) {
        const lat = src.lat + ((dest.lat - src.lat) * i) / (count + 1);
        const lng = src.lng + ((dest.lng - src.lng) * i) / (count + 1);
        points.push({ lat, lng });
      }
      return points;
    };
    const midPoints = generateIntermediatePoints(srcCoords, destCoords, 30);

    // -----------------------------
    // Fetch crime data for midpoints
    // -----------------------------
    const fetchCrimeData = async () => {
      const dateStr = "2024-01";

      const allCrimes = await Promise.all(
        midPoints.map(async (p) => {
          try {
            const res = await fetch(`http://localhost:5000/api/crime?date=${dateStr}&lat=${p.lat}&lng=${p.lng}`);
            if (!res.ok) return [];
            const data = await res.json();
            return data || [];
          } catch (err) {
            return [];
          }
        })
      );

      // -----------------------------
      // Place shapes on the map
      // -----------------------------
      allCrimes.forEach((crimesAtPoint, index) => {
        if (crimesAtPoint.length === 0) return;

        const crime = crimesAtPoint[0];
        const type = crime.category || "default";
        const lat = midPoints[index].lat;
        const lng = midPoints[index].lng;

        // Crime shapes scaled for ~2 km
        const crimeShapes = {
          // Drugs → big red circle
          "drugs": () =>
            L.circle([lat, lng], { color: "red", fillColor: "#f03", fillOpacity: 0.5, radius: 2000 }).addTo(mapRef.current),

          // Burglary → triangle polygon
          "burglary": () =>
            L.polygon([
              [lat + 0.018, lng],
              [lat - 0.009, lng - 0.018],
              [lat - 0.009, lng + 0.018],
            ], { color: "green", fillColor: "#90ee90", fillOpacity: 0.6 }).addTo(mapRef.current),

          // Theft → big circle marker
          "theft": () =>
            L.circleMarker([lat, lng], { radius: 40, color: "blue", fillColor: "#3399ff", fillOpacity: 0.7 }).addTo(mapRef.current),

          // Violent crime → rectangle
          "violent-crime": () =>
            L.rectangle([[lat + 0.009, lng - 0.009], [lat - 0.009, lng + 0.009]], { color: "purple", fillColor: "#b19cd9", fillOpacity: 0.5 }).addTo(mapRef.current),

          // Anti-social behaviour → triangle
          "anti-social-behaviour": () =>
            L.polygon([
              [lat + 0.018, lng],
              [lat - 0.009, lng - 0.018],
              [lat - 0.009, lng + 0.018],
            ], { color: "orange", fillColor: "#ffa500", fillOpacity: 0.6 }).addTo(mapRef.current),
        };

        // Add shape to map
        let shapeMarker = crimeShapes[type]?.();
        if (!shapeMarker) {
          shapeMarker = L.marker([lat, lng], { icon: crimeIcons[type] || crimeIcons["default"] }).addTo(mapRef.current);
        }

        // Bind popup
        shapeMarker.bindPopup(`<b>${type.replace(/-/g, " ")}</b><br>${crime.location?.street?.name || ""}`);
      });
    };

    fetchCrimeData();

    // Cleanup on unmount
    return () => {
      if (routingRef.current) mapRef.current.removeControl(routingRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [srcCoords, destCoords, navigate, srcIcon, destIcon]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <h2 className="text-2xl font-semibold text-indigo-600 text-center py-4">Route Map</h2>
      <div id="map" className="flex-1 shadow-md rounded-t-xl" style={{ width: "100%" }}></div>
      <div className="flex justify-center py-4">
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MapPage;
