import React, { useState } from 'react';
import { Film, Search, Menu, X, Heart, Star, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import storage from '../utils/storage';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies?search=${encodeURIComponent(search)}`);
      setSearch(''); 
      setIsOpen(false); 
    }
  };

  const navItems = [
    { label: 'Movies', path: '/movies', icon: <Film className="w-5 h-5" /> },
    { label: 'Top Rated', path: '/top-rated', icon: <Star className="w-5 h-5" /> },
    { label: 'Coming Soon', path: '/coming-soon', icon: <Calendar className="w-5 h-5" /> },
    {
      label: `Favorite Actors (${storage.getFavorites().length})`,
      path: '/favorite-actors',
      icon: <Heart className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-black" />
            <span className="text-xl font-bold text-black">MovieDB</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="bg-gray-100 text-black px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600">
                <Search className="w-5 h-5" />
              </button>
            </form>
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 text-black hover:text-white transition-all duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              onClick={toggleDarkMode}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button
              className="md:hidden text-black"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg rounded-lg">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-gray-100 text-black px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 text-black hover:text-white transition-all duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
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
