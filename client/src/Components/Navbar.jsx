import React , {useState} from 'react';
import { Link } from "react-router-dom";

function Navbar() {
  const [ isLoggedIn , setIsLoggedIn] = useState( false ) ;
  const defaultProfile = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  // default pic is here which is set if u looged in 
  const HandleSignIn =  () => {
    setIsLoggedIn(true);
  };
  const HandleLogout = () => {
    setIsLoggedIn( false ) ;
  };
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      {/* shadow -lg means every content on  the navbsr will be outraegd from others  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* sm --> means smaller devices css prop after the :  */}
        {/* lg --> the same for  larger devices also  */}
        <div className="flex justify-between h-16 items-center">
          {/* jusity between will make the spacing much more efficent  */}
          
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold">
            Crimora
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link>
            <Link to="/services" className="hover:text-indigo-200 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-indigo-200 transition-colors">Contact</Link>
          </div>

          {
            /*
            Note --> an imp thing ! 
            md : hidden means for medium and bigeer devices this part will be hidden 
            hidden md : {properties}   means for smaller and devices lower in configuration code will be hidden but larger one is runs 
            */
          }

          {/* Action Button */}
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
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              {/* You can add a hamburger icon here */}
              ☰
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
