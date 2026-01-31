import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight hidden sm:block">
            <span className="text-slate-800">Doheera</span>
            <span className="text-gold-accent">Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white/50 backdrop-blur-sm border border-black/5 p-2 px-4 rounded-2xl items-center flex w-32 sm:w-64 md:w-96 transition-all duration-300 focus-within:ring-2 ring-purple-200"
        >
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none w-full text-slate-700 text-sm md:text-base pr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="hover:scale-110 transition-transform">
            <FaSearch className="text-slate-500 text-lg" />
          </button>
        </form>

        <nav>
          <ul className="flex items-center gap-6">
            <Link to="/" className="hidden md:block">
              <li className="text-slate-700 font-semibold hover:text-purple-600 transition-colors">
                Home
              </li>
            </Link>
            <Link to="/about" className="hidden md:block">
              <li className="text-slate-700 font-semibold hover:text-purple-600 transition-colors">
                About
              </li>
            </Link>

            <Link to="/profile" className="flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-white/40 p-1 pr-3 rounded-full hover:bg-white/60 transition-all border border-black/5">
                  <img
                    src={currentUser.avatar}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-purple-200"
                  />
                  <span className="hidden sm:inline text-sm font-bold text-slate-700">
                    {currentUser.username?.split(' ')[0] || 'User'}
                  </span>
                </div>
              ) : (
                <div className="modern-btn px-6 py-2 rounded-btn font-bold shadow-lg flex items-center gap-2">
                  <FaUserCircle className="text-lg" />
                  <span>Login</span>
                </div>
              )}
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
