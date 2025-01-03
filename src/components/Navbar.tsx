// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Film, Search, Menu, X, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import storage from '../utils/storage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/movies?search=${search}`);
  };

  const navItems = [
    { label: 'Movies', path: '/movies' },
    { label: 'Top Rated', path: '/top-rated' },
    { label: 'Coming Soon', path: '/coming-soon' },
  ];

  const favorites = storage.getFavorites();

  return (
    <nav className="bg-black">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold">MovieDB</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="bg-gray-800 text-white p-2 rounded-lg"
              />
            </form>
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link key={item.label} to={item.path}>
                  {item.label}
                </Link>
              ))}
              <Link to="/favorite-actors">
                <Heart className="w-6 h-6" />
                <span>Favorite Actors ({favorites.length})</span>
              </Link>
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-gray-800 text-white p-2 rounded-lg"
                />
              </form>
              {navItems.map((item) => (
                <Link key={item.label} to={item.path}>
                  {item.label}
                </Link>
              ))}
              <Link to="/favorite-actors">
                <Heart className="w-6 h-6" />
                <span>Favorite Actors ({favorites.length})</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;