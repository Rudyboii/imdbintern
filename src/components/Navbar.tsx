import React, { useState } from "react";
import { Film, Search, Menu, X, Heart, Star, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import storage from "../utils/storage";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies?search=${encodeURIComponent(search)}`);
      setSearch("");
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: "Movies", path: "/movies", icon: <Film className="w-5 h-5" /> },
    { label: "Top Rated", path: "/top-rated", icon: <Star className="w-5 h-5" /> },
    { label: "Coming Soon", path: "/coming-soon", icon: <Calendar className="w-5 h-5" /> },
    {
      label: `Favorite Actors (${storage.getFavorites().length})`,
      path: "/favorite-actors",
      icon: <Heart className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black shadow-lg border-b border-gray-700 text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-gold-500" />
            <span className="text-2xl font-serif font-bold text-gold-500 tracking-wide">
              Movie<span className="text-white">DB</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="bg-gray-800 text-white px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gold-500 hover:text-gold-300"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 text-white hover:text-gold-500 transition-all duration-300"
                >
                  {item.icon}
                  <span className="font-serif">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Dark Mode & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={toggleDarkMode}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-gray-900 shadow-lg rounded-lg">
            <div className="flex flex-col gap-4 px-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-gray-800 text-white px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gold-500 hover:text-gold-300"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 text-white hover:text-gold-500 transition-all duration-300"
                >
                  {item.icon}
                  <span className="font-serif">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
