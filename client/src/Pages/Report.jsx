import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ReportCrime() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [intensity, setIntensity] = useState("Low");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !details || !location) {
      toast.error("❌ All fields are required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        toast.error("You must be logged in to report a crime");
        return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/crime/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          type,
          details,
          location,
          intensity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Failed to report crime");
        return;
      }

      toast.success("✅ Crime reported successfully");

      // Clear form
      setName("");
      setType("");
      setDetails("");
      setLocation("");
      setIntensity("Low");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />

      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Report a Crime
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Crime Type */}
          <input
            type="text"
            placeholder="Crime Type (Theft, Assault, etc.)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Crime Details */}
          <textarea
            placeholder="Crime Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="4"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Intensity */}
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportCrime;
