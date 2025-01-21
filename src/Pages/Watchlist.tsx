import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  genre: string[];
  image: string;
  rating: number;
}

interface TVShow {
  id: number;
  title: string;
  releaseDate: string;
  genre: string[];
  image: string;
  rating: number;
}

const Watchlist: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true); 
      try {
        const movieList = await api.getWatchlist("movie"); 
        const tvShowList = await api.getWatchlist("tv"); 
        setMovies(movieList);
        setTvShows(tvShowList);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (itemId: number, type: string) => {
    try {
      if (type === "movie") {
        await api.removeFromWatchlist(itemId);
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== itemId));
      } else {
        await api.removeTVShowFromWatchlist(itemId);
        setTvShows((prevTvShows) => prevTvShows.filter((tv) => tv.id !== itemId));
      }
    } catch (error) {
      console.error("Error removing item from watchlist:", error);
    }
  };

  
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div>
        <h2 className="text-xl font-semibold mb-2">Movies</h2>
        {movies.length === 0 ? (
          <p className="text-gray-400">Your movie watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 text-white rounded-lg p-4 shadow-lg cursor-pointer hover:scale-105 transform transition-all"
                onClick={() => handleMovieClick(movie.id)} 
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
                <p className="text-gray-400">Release Date: {movie.releaseDate}</p>
                <p className="text-gray-400">Genre: {movie.genre.join(", ")}</p>
                <p className="text-gray-400">Rating: {movie.rating}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleRemoveFromWatchlist(movie.id, "movie");
                  }}
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:bg-red-400 transition-colors"
                >
                  Remove from Watchlist
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default Watchlist;
