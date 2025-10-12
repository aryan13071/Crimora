import React, { useState } from 'react';
import { Link } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const defaultProfile = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const HandleSignIn = () => setIsLoggedIn(true);
  const HandleLogout = () => setIsLoggedIn(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold">
            Crimora
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link>
            <Link to="/services" className="hover:text-indigo-200 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-indigo-200 transition-colors">Contact</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <img
                  src={defaultProfile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                />
                <button
                  onClick={HandleLogout}
                  className="bg-white text-indigo-600 px-3 py-1 rounded-md font-semibold hover:bg-indigo-100 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={HandleSignIn}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-100 transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative">
            <button 
              onClick={toggleMobileMenu} 
              className="text-white focus:outline-none text-2xl"
            >
              ☰
            </button>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-indigo-600 rounded-md shadow-lg z-20">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-indigo-100 transition"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-indigo-100 transition"
                >
                  About
                </Link>
                <Link 
                  to="/services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-indigo-100 transition"
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-indigo-100 transition"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
