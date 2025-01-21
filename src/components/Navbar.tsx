import React, { useState, useEffect } from 'react';
import { Film, Search, Menu, X, Heart, Star, Users } from "lucide-react";  // Imported the icons
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSearchResults = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=734a09c1281680980a71703eb69d9571&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.results) {
        setSearchResults(data.results);
      } else {
        setError('No results found.');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (id: number, mediaType: string) => {
    if (mediaType === 'person') {
      navigate(`/actor/${id}`);
    } else if (mediaType === 'tv') {
      navigate(`/tv/${id}`);
    } else {
      navigate(`/movie/${id}`);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const navItems = [
    { label: 'Movies', path: '/movies', icon: <Film className="w-5 h-5" /> },
    { label: 'Top Rated', path: '/top-rated', icon: <Star className="w-5 h-5" /> },
    { label: 'Actors', path: 'popular-casts', icon: <Users className="w-5 h-5" /> },
    { label: `Favorite Actors`, path: "/favorite-actors", icon: <Heart className="w-5 h-5" /> },
  ];

  const movies = searchResults.filter((result) => result.media_type === 'movie');
  const tvShows = searchResults.filter((result) => result.media_type === 'tv');
  const actors = searchResults.filter((result) => result.media_type === 'person');

  return (
    <nav className="bg-[#003366] text-white shadow-md sticky top-0 z-50 transition-all ease-in-out duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <Link
          to="/"
          className="flex items-center gap-3 text-yellow-400 hover:text-yellow-300 transition duration-300"
        >
          <Film className="w-8 h-8 text-yellow-400" />
          <span className="text-3xl font-serif font-bold tracking-wider">MovieDB</span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Desktop Navbar Items */}
        <div className="hidden md:flex items-center gap-10">
          <form onSubmit={handleSearch} className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, actors..."
              className="bg-[#003366] text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full transition-all duration-300"
            />
            {loading && (
              <div className="absolute top-full left-0 w-full bg-black text-white p-2 rounded-b-lg">
                Loading...
              </div>
            )}
            {error && (
              <div className="absolute top-full left-0 w-full bg-red-600 text-white p-2 rounded-b-lg">
                {error}
              </div>
            )}
            {searchResults.length > 0 && (
              <ul className="absolute bg-[#003366] text-white w-full rounded-lg shadow-xl max-h-60 overflow-y-auto mt-2 transition-all duration-300">
                {movies.length > 0 && (
                  <li>
                    <h3 className="bg-[#003366] p-3 text-white font-semibold">Movies</h3>
                    {movies.map((result) => (
                      <li
                        key={result.id}
                        onClick={() => handleResultClick(result.id, result.media_type)}
                        className="p-3 hover:bg-[#003366] cursor-pointer transition-all duration-300"
                      >
                        <div className="flex items-center">
                          {result.poster_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                              alt={result.title || result.name}
                              className="inline-block mr-3 w-16 h-24 rounded-lg"
                            />
                          )}
                          <span className="text-sm font-semibold">{result.title || result.name}</span>
                          {result.media_type === 'movie' && result.release_date && (
                            <span className="text-xs text-gray-400 ml-2">
                              ({new Date(result.release_date).getFullYear()})
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </li>
                )}
                {tvShows.length > 0 && (
                  <li>
                    <h3 className="bg-[#003366] p-3 text-white font-semibold">TV Shows</h3>
                    {tvShows.map((result) => (
                      <li
                        key={result.id}
                        onClick={() => handleResultClick(result.id, result.media_type)}
                        className="p-3 hover:bg-[#003366] cursor-pointer transition-all duration-300"
                      >
                        <div>{result.title || result.name}</div>
                      </li>
                    ))}
                  </li>
                )}
                {actors.length > 0 && (
                  <li>
                    <h3 className="bg-[#003366] p-3 text-white font-semibold">Actors</h3>
                    {actors.map((result) => (
                      <li
                        key={result.id}
                        onClick={() => handleResultClick(result.id, result.media_type)}
                        className="p-3 hover:bg-[#003366] cursor-pointer transition-all duration-300"
                      >
                        <div>{result.name}</div>
                      </li>
                    ))}
                  </li>
                )}
              </ul>
            )}
          </form>

          {/* Navbar Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-white hover:text-yellow-500 flex items-center gap-2 transition-all duration-300"
              >
                {item.icon && item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Dark Mode Toggle (Desktop) */}
          <button
            className="bg-[#003366] text-white px-4 py-2 rounded-md hover:bg-[#003366] transition-all duration-300"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀️ " : "🌙 "}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#003366] text-white p-6">
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, actors..."
              className="bg-[#003366] text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full transition-all duration-300"
            />
          </form>

          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-white hover:text-yellow-500 py-3 flex items-center gap-2 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon && item.icon}
              {item.label}
            </Link>
          ))}

          {/* Dark Mode Toggle (Mobile) */}
          <button
            className="bg-[#003366] text-white px-4 py-2 rounded-md hover:bg-[#003366] transition-all duration-300 mt-6"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀️ " : "🌙 "}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
