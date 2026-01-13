import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import srcMarker from "../Assets/Source.png";
import destMarker from "../Assets/Destination.png";
import AntiSocialBehaviour from "../Assets/AntiSocialBehavoiur.png";
import Drugs from "../Assets/Drugs.png";
import ViolentCrime from "../Assets/ViolentCrime.png";
import Burglary from "../Assets/Theft.png";
import Theft from "../Assets/Theft.png";
import All from "../Assets/All.png";

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const routingRef = useRef(null);
  const crimeLayersRef = useRef([]);
  const { srcCoords, destCoords } = location.state || {};


  // LOOK ---> THODA ZOOM pe work karna icon and all ke 

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
  // Crime icons (fixed size)
  // -----------------------------
  const crimeIcons = {
    "anti-social-behaviour": L.icon({
      iconUrl: AntiSocialBehaviour,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }),
    drugs: L.icon({
      iconUrl: Drugs,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }),
    "violent-crime": L.icon({
      iconUrl: ViolentCrime,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }),
    burglary: L.icon({
      iconUrl: Burglary,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }),
    theft: L.icon({
      iconUrl: Theft,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }),
    default: L.icon({
      iconUrl: All,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    }),
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

    if (routingRef.current) {
      mapRef.current.removeControl(routingRef.current);
    }

    // -----------------------------
    // Routing control
    // -----------------------------
    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(srcCoords.lat, srcCoords.lng),
        L.latLng(destCoords.lat, destCoords.lng),
      ],
      routeWhileDragging: false,
      lineOptions: { styles: [{ color: "green", weight: 6 }] },
      createMarker: (i, wp) => {
        const icon = i === 0 ? srcIcon : destIcon;
        const label = i === 0 ? "📍 Source" : "🏁 Destination";
        return L.marker(wp.latLng, { icon })
          .addTo(mapRef.current)
          .bindPopup(label)
          .openPopup();
      },
      addWaypoints: false,
      draggableWaypoints: false,
    }).addTo(mapRef.current);

    const bounds = L.latLngBounds(
      [srcCoords.lat, srcCoords.lng],
      [destCoords.lat, destCoords.lng]
    );
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

    // -----------------------------
    // Draw crime shapes and icons
    // -----------------------------
    const getScaleFactor = (zoom) =>
      zoom >= 15 ? 2 : zoom >= 13 ? 1.5 : 1;

    const drawCrime = (type, lat, lng) => {
      const zoom = mapRef.current.getZoom();
      const scale = getScaleFactor(zoom);

      const colors = {
        drugs: { color: "#8B0000", fillColor: "#B22222" },
        burglary: { color: "#006400", fillColor: "#228B22" },
        theft: { color: "#00008B", fillColor: "#0000CD" },
        "violent-crime": { color: "#4B0082", fillColor: "#6A5ACD" },
        "anti-social-behaviour": {
          color: "#FF8C00",
          fillColor: "#FF7F50",
        },
      };

      let shape;

      switch (type) {
        case "drugs":
          shape = L.circle([lat, lng], {
            ...colors[type],
            fillOpacity: 0.5,
            radius: 1200 * scale,
          }).addTo(mapRef.current);
          break;

        case "burglary":
        case "anti-social-behaviour":
          shape = L.polygon(
            [
              [lat + 0.012 * scale, lng],
              [lat - 0.009 * scale, lng - 0.012 * scale],
              [lat - 0.009 * scale, lng + 0.012 * scale],
            ],
            { ...colors[type], fillOpacity: 0.6 }
          ).addTo(mapRef.current);
          break;

        case "theft":
          shape = L.circleMarker([lat, lng], {
            radius: 40 * scale,
            ...colors[type],
            fillOpacity: 0.7,
          }).addTo(mapRef.current);
          break;

        case "violent-crime":
          shape = L.rectangle(
            [
              [lat + 0.009 * scale, lng - 0.009 * scale],
              [lat - 0.009 * scale, lng + 0.009 * scale],
            ],
            { ...colors[type], fillOpacity: 0.5 }
          ).addTo(mapRef.current);
          break;

        default:
          shape = null;
      }

      const iconMarker = L.marker([lat, lng], {
        icon: crimeIcons[type] || crimeIcons.default,
      }).addTo(mapRef.current);

      iconMarker.bindPopup(`<b>${type.replace(/-/g, " ")}</b>`);

      crimeLayersRef.current.push({
        type,
        lat,
        lng,
        shape,
        iconMarker,
        isUserReported: false, // generated crime
      });
    };


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
    // Draw GENERATED crimes on route (30 points)
    // -----------------------------
    const crimeTypes = [
      "drugs",
      "burglary",
      "theft",
      "violent-crime",
      "anti-social-behaviour",
    ];

    midPoints.forEach((point, idx) => {
      // Pick crime type cyclically so they are distributed
      const type = crimeTypes[idx % crimeTypes.length];

      // Draw the crime using existing logic
      drawCrime(type, point.lat, point.lng);
    });


    // ==============================
    // FETCH USER-REPORTED CRIMES FROM DB
    // ==============================
    const fetchReportedCrimes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/crime/reported");
        const crimes = await res.json();

        for (const crime of crimes) {
          const geoRes = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
              crime.location
            )}&key=b79a86d628d04e69906d26e79a1f5d1a`
          );

          const geoData = await geoRes.json();
          if (!geoData.results?.length) continue;

          const { lat, lng } = geoData.results[0].geometry;

          const marker = L.circleMarker([lat, lng], {
            radius: 20,
            color: "#e11d48",
            fillColor: "#e11d48",
            fillOpacity: 0.85,
          }).addTo(mapRef.current);

          marker.bindPopup(`
            <div style="min-width:200px">
              <b>Reported Crime</b><br/>
              <b>Name:</b> ${crime.name}<br/>
              <b>Type:</b> ${crime.type}<br/>
              <b>Intensity:</b> ${crime.intensity}<br/>
              <b>Details:</b> ${crime.details}<br/><br/>

              <!-- 🔥 CHANGE MADE HERE: Chat button added -->
              <button 
                id="chat-${crime._id}" 
                style="
                  padding:6px 10px;
                  background:#4f46e5;
                  color:white;
                  border:none;
                  border-radius:6px;
                  cursor:pointer;
                  width:100%;
                ">
                💬 Chat with Reporter
              </button>
            </div>
          `);

          // 🔥 CHANGE MADE HERE: attach click handler after popup opens
          marker.on("popupopen", () => {
            const btn = document.getElementById(`chat-${crime._id}`);

            if (btn) {
              btn.onclick = () => {
                navigate("/chat", {
                  state: {
                    crimeId: crime._id,
                    receiverId: crime.user._id,
                    receiverEmail: crime.user.email,
                  },
                });
              };
            }
          });



          crimeLayersRef.current.push({
            type: crime.type,
            lat,
            lng,
            shape: marker,
            iconMarker: null,
            isUserReported: true, // 🔥 critical flag
          });
        }
      } catch (err) {
        console.error("Failed to load reported crimes", err);
      }
    };

    fetchReportedCrimes();

    // -----------------------------
    // Update shapes on zoom (icons stay intact)
    // -----------------------------
    mapRef.current.on("zoomend", () => {
      const currentLayers = [...crimeLayersRef.current];
      crimeLayersRef.current = [];

      currentLayers.forEach((item) => {
        // User-reported crimes should NOT be redrawn
        if (item.isUserReported) {
          crimeLayersRef.current.push(item);
          return;
        }

        if (item.shape) mapRef.current.removeLayer(item.shape);
        if (item.iconMarker) mapRef.current.removeLayer(item.iconMarker);

        drawCrime(item.type, item.lat, item.lng);
      });
    });

    return () => {
      if (routingRef.current) mapRef.current.removeControl(routingRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [srcCoords, destCoords, navigate]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <h2 className="text-2xl font-semibold text-indigo-600 text-center py-4">
        Route Map
      </h2>

      <div id="map" className="flex-1 shadow-md rounded-t-xl" />

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
