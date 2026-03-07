
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">📚</span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">ContentHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/blogs" className="text-gray-300 hover:text-white transition-colors">Blogs</Link>
            <Link to="/videos" className="text-gray-300 hover:text-white transition-colors">Videos</Link>

            {isAuthenticated ? (
              <>
                <Link to="/create" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Create Post</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
                <div className="flex items-center gap-4 border-l border-white/20 pl-4 ml-2">
                  <span className="text-sm text-gray-400">Hi, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 border-l border-white/20 pl-4 ml-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
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
