import React from "react";
import { Bell, MapPin, Bot, Users, Star, Gift } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Bell className="w-8 h-8 text-red-500" />,
      title: "Real-Time Notifications",
      desc: "Stay informed with instant alerts whenever you're near a reported crime spot or unsafe zone.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "User Reports on Map",
      desc: "View live community crime reports marked directly on your safest route — always know what lies ahead.",
    },
    {
      icon: <Bot className="w-8 h-8 text-green-600" />,
      title: "Prediction & Chatbot",
      desc: "Use AI-powered predictions to identify risky zones ahead, and chat with Crimora Bot for real-time help.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "User Contribution",
      desc: "Be part of a safer community by submitting reports, sharing insights, and validating existing data.",
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Rating System",
      desc: "Rate crime spots and report accuracy to help others trust reliable data sources and keep the map clean.",
    },
    {
      icon: <Gift className="w-8 h-8 text-pink-500" />,
      title: "Rewards & Recognition",
      desc: "Earn badges, rewards, and recognition for being an active Crimora user contributing to safety.",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-16">
      {/* Hero / Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Our <span className="text-blue-600">Services</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Crimora provides intelligent safety services — from real-time alerts to AI-based predictions, helping you travel with confidence.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all text-center"
          >
            <div className="flex justify-center mb-5">{s.icon}</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{s.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-100 p-10 rounded-2xl shadow-inner text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Safe Navigation. Smart Insights. Stronger Community.
        </h3>
        <p className="text-gray-700">
          Join Crimora today — where technology meets community safety. Together, we make every journey secure.
        </p>
      </div>
    </div>
  );
}
