import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import useLogout from "../../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  
  // Check if user is currently on the chat page
  const isOnChatPage = location.pathname === '/chat';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 fixed w-full top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">Study<span className="text-blue-500">Sphere</span></span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            {authUser ? (
              <div className="flex items-center gap-4">
                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md"
                  >
                    <img 
                      src={authUser.profilePic} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{authUser.fullName}</span>
                    <FaCaretDown className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <BiUserCircle className="text-lg" />
                          Edit Profile
                        </div>
                      </Link>
                      <hr className="border-gray-700 my-1" />
                      <button 
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }} 
                        className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        disabled={loading}
                      >
                        <div className="flex items-center gap-2">
                          <BiLogOut className="text-lg" />
                          {loading ? 'Logging out...' : 'Logout'}
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Only show chat link if not on chat page */}
                {!isOnChatPage && (
                  <Link to="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Chat
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 pt-2 pb-3 px-4">
          {authUser ? (
            <div className="flex flex-col space-y-2">
              <span className="text-gray-300 text-sm py-2">Hi, {authUser.fullName}</span>
              {!isOnChatPage && (
                <Link 
                  to="/chat" 
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Chat
                </Link>
              )}
              <Link 
                to="/profile" 
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <BiUserCircle size={18} />
                  Edit Profile
                </div>
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                disabled={loading}
              >
                <BiLogOut className="w-4 h-4" />
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
