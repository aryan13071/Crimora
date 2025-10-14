import React from "react";
import { Shield, Map, Bell, BarChart3, FileText } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Map className="w-8 h-8 text-blue-600" />,
      title: "Smart Route Finder",
      desc: "Finds the safest and shortest path between your source and destination, highlighting zones with red, orange, and yellow colors based on crime intensity."
    },
    {
      icon: <Bell className="w-8 h-8 text-red-500" />,
      title: "Real-Time Alerts",
      desc: "Instant notification when you’re within 20 meters of a known crime spot, helping you stay alert and safe."
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "View Reports & Contributions",
      desc: "Easily access your submitted reports, check their status, and see your impact on community safety."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: "Crime Analytics Dashboard",
      desc: "View charts and statistics on crime distribution, frequency, and location-based insights."
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Stay Safe, Stay Smart with <span className="text-blue-600">Crimora</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Crimora helps you navigate safely by finding secure routes, alerting you near danger zones, and showing detailed crime analytics.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all text-center"
          >
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{f.title}</h2>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Contribution Section */}
      <div className="bg-blue-100 p-8 rounded-2xl shadow-inner text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Your Contribution Matters</h3>
        <p className="text-gray-700">
          Every report you make helps others stay safe. Join us in making our streets safer — one report at a time.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        © 2025 Crimora | Making Navigation Safer
      </footer>
    </div>
  );
}
