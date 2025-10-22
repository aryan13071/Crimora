import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import srcMarker from "../Assets/Source.png";
import destMarker from "../Assets/Destination.png";
import AntiSocialBehavoiur from "../Assets/AntiSocialBehavoiur.png"
import Drugs from "../Assets/Drugs.png"
import ViolentCrime from "../Assets/ViolentCrime.png"
import Burglary from "../Assets/Theft.png"
import Theft from "../Assets/Theft.png"
import All from "../Assets/All.png"

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const routingRef = useRef(null);
  const crimeLayersRef = useRef([]);
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
  // Fallback crime icons (always on top)
  // -----------------------------
  const crimeIcons = {
    "anti-social-behaviour": L.icon({ iconUrl: AntiSocialBehavoiur, iconSize: [30, 30], iconAnchor: [15, 30] }),
    "burglary": L.icon({ iconUrl: Burglary , iconSize: [30, 30], iconAnchor: [15, 30] }),
    "violent-crime": L.icon({ iconUrl: ViolentCrime, iconSize: [30, 30], iconAnchor: [15, 30] }),
    "drugs": L.icon({ iconUrl: Drugs, iconSize: [30, 30], iconAnchor: [15, 30] }),
    "theft": L.icon({ iconUrl: Theft, iconSize: [30, 30], iconAnchor: [15, 30] }),
    "default": L.icon({ iconUrl: All, iconSize: [30, 30], iconAnchor: [15, 30] }),
  };

  useEffect(() => {
    if (!srcCoords || !destCoords) {
      alert("Missing location data. Redirecting...");
      navigate("/");
      return;
    }

    // -----------------------------
    // Initialize map
    // -----------------------------
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // Remove previous routing
    if (routingRef.current) mapRef.current.removeControl(routingRef.current);

    // -----------------------------
    // Routing control
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

    // Fit bounds
    const bounds = L.latLngBounds([srcCoords.lat, srcCoords.lng], [destCoords.lat, destCoords.lng]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

    // -----------------------------
    // Generate intermediate points
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
    // Draw crime shapes and icons
    // -----------------------------
    const getScaleFactor = (zoom) => {
      if (zoom >= 15) return 2;
      if (zoom >= 13) return 1.5;
      return 1;
    };

    const drawCrime = (type, lat, lng) => {
      const zoom = mapRef.current.getZoom();
      const scale = getScaleFactor(zoom);

      const colors = {
        "drugs": { color: "#8B0000", fillColor: "#B22222" },
        "burglary": { color: "#006400", fillColor: "#228B22" },
        "theft": { color: "#00008B", fillColor: "#0000CD" },
        "violent-crime": { color: "#4B0082", fillColor: "#6A5ACD" },
        "anti-social-behaviour": { color: "#FF8C00", fillColor: "#FF7F50" },
      };

      let shape;
      switch (type) {
        case "drugs":
          shape = L.circle([lat, lng], { ...colors[type], fillOpacity: 0.5, radius: 2000 * scale }).addTo(mapRef.current);
          break;
        case "burglary":
          shape = L.polygon([
            [lat + 0.018 * scale, lng],
            [lat - 0.009 * scale, lng - 0.018 * scale],
            [lat - 0.009 * scale, lng + 0.018 * scale],
          ], { ...colors[type], fillOpacity: 0.6 }).addTo(mapRef.current);
          break;
        case "theft":
          shape = L.circleMarker([lat, lng], { radius: 40 * scale, ...colors[type], fillOpacity: 0.7 }).addTo(mapRef.current);
          break;
        case "violent-crime":
          shape = L.rectangle([[lat + 0.009 * scale, lng - 0.009 * scale], [lat - 0.009 * scale, lng + 0.009 * scale]], { ...colors[type], fillOpacity: 0.5 }).addTo(mapRef.current);
          break;
        case "anti-social-behaviour":
          shape = L.polygon([
            [lat + 0.018 * scale, lng],
            [lat - 0.009 * scale, lng - 0.018 * scale],
            [lat - 0.009 * scale, lng + 0.018 * scale],
          ], { ...colors[type], fillOpacity: 0.6 }).addTo(mapRef.current);
          break;
        default:
          shape = L.marker([lat, lng], { icon: crimeIcons[type] || crimeIcons["default"] }).addTo(mapRef.current);
      }

      // Add icon marker on top
      const iconMarker = L.marker([lat, lng], { icon: crimeIcons[type] || crimeIcons["default"] }).addTo(mapRef.current);
      iconMarker.bindPopup(`<b>${type.replace(/-/g, " ")}</b>`);

      // Keep reference to layers for zoom updates
      crimeLayersRef.current.push({ type, lat, lng, shape, iconMarker });
    };

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

      allCrimes.forEach((crimesAtPoint, index) => {
        if (crimesAtPoint.length === 0) return;
        const crime = crimesAtPoint[0];
        drawCrime(crime.category || "default", midPoints[index].lat, midPoints[index].lng);
      });
    };

    fetchCrimeData();

    // -----------------------------
    // Update crime shapes on zoom
    // -----------------------------
    mapRef.current.on("zoomend", () => {
      crimeLayersRef.current.forEach((item) => {
        mapRef.current.removeLayer(item.shape);
        mapRef.current.removeLayer(item.iconMarker);
        drawCrime(item.type, item.lat, item.lng);
      });
      crimeLayersRef.current = [];
    });

    // Cleanup
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
