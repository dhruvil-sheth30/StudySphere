import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();

  return (
    <nav className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">Study<span className="text-blue-500">Sphere</span></span>
            </Link>
          </div>
          <div className="flex items-center">
            {authUser ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">Hi, {authUser.fullName}</span>
                <Link to="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Chat
                </Link>
                {!loading ? (
                  <button 
                    onClick={logout} 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    Logout <BiLogOut className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="loading loading-spinner text-white"></span>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
