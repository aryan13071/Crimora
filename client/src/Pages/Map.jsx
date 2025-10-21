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

  // Custom Icons
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

  useEffect(() => {
    if (!srcCoords || !destCoords) {
      alert("Missing location data. Redirecting...");
      navigate("/");
      return;
    }

    // Generating mid point btw the paths 

    function generateIntermediatePoints(src, dest, count) {
      const points = [];
      for (let i = 1; i <= count; i++) {
        const lat = src.lat + (dest.lat - src.lat) * (i / (count + 1));
        const lng = src.lng + (dest.lng - src.lng) * (i / (count + 1));
        points.push({ lat, lng });
      }
      return points;
    }

    const midPoints = generateIntermediatePoints(srcCoords, destCoords, 30);
    console.log("Intermediate points:", midPoints);


    // Initialize map if not already
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        zoomControl: true,
      });
    }

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // Remove existing routing if present
    if (routingRef.current) {
      mapRef.current.removeControl(routingRef.current);
    }

    // Add routing control
    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(srcCoords.lat, srcCoords.lng),
        L.latLng(destCoords.lat, destCoords.lng),
      ],
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: "green", weight: 6 }],
      },
      createMarker: (i, wp, n) => {
        const icon = i === 0 ? srcIcon : destIcon;
        const label = i === 0 ? "📍 Source" : "🏁 Destination";
        const marker = L.marker(wp.latLng, { icon })
          .addTo(mapRef.current)
          .bindPopup(label)
          .openPopup(); // always open
        return marker;
      },
      addWaypoints: false,
      draggableWaypoints: false,
    }).addTo(mapRef.current);

    // Automatically fit map bounds to show both points
    const bounds = L.latLngBounds(
      [srcCoords.lat, srcCoords.lng],
      [destCoords.lat, destCoords.lng]
    );
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (routingRef.current) {
        mapRef.current.removeControl(routingRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [srcCoords, destCoords, navigate, srcIcon, destIcon]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-indigo-600 text-center py-4">
        Route Map
      </h2>

      {/* Map container */}
      <div
        id="map"
        className="flex-1 shadow-md rounded-t-xl"
        style={{ width: "100%" }}
      ></div>

      {/* Back Button */}
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
