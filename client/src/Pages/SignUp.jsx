import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
//import { adaptEventHandlers } from "recharts/types/util/types";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!emailRegex.test(email)) {
      toast.error("❌ Invalid email address", { position: "top-left" });
      return;
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      toast.error(
        "❌ Password must be 8+ chars, include upper, lower, number & special char",
        { position: "top-left" }
      );
      return;
    }

    // 🔴 ADDED: API call to backend
    try {

      console.log("it has arrived the sign up for calling ");
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      console.log(`data after the api from the backend  ${data} `);


      if (!res.ok) {
        toast.error(data.msg || "Signup failed", { position: "top-left" });
        return;
      }

      toast.success("✅ Account created successfully!", {
        position: "top-left",
      });

      // 🔴 ADDED: optional token store
      localStorage.setItem("token", data.token);

      setTimeout(() => {
        navigate("/logIn");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Server error", { position: "top-left" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain 8+ chars, uppercase, lowercase, number & special symbol
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
