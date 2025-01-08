import React, { useState, useEffect } from "react";
import api from "../api";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  genre: string[];
  image: string;
  rating: number;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch the watchlist when the component mounts
  useEffect(() => {
    const fetchWatchlist = async () => {
      const movies = await api.getWatchlist();
      setWatchlist(movies);
    };
    fetchWatchlist();
  }, []);

  // Fetch movie details from TMDB API and add to watchlist
  const handleAddToWatchlist = async (movieId: number) => {
    setLoading(true);
    try {
      const apiKey = "734a09c1281680980a71703eb69d9571";
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
      );
      const data = await response.json();

      // Map the TMDB response to the Movie structure
      const movie: Movie = {
        id: data.id,
        title: data.title,
        releaseDate: data.release_date,
        genre: data.genres.map((genre: { name: string }) => genre.name),
        image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        rating: data.vote_average,
      };

      // Add the movie to the mock watchlist
      await api.addMovieToWatchlist(movie);

      // Refresh the watchlist
      const updatedWatchlist = await api.getWatchlist();
      setWatchlist(updatedWatchlist);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
    setLoading(false);
  };

  // Remove a movie from the watchlist
  const handleRemoveFromWatchlist = async (movieId: number) => {
    await api.removeMovieFromWatchlist(movieId);
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.id !== movieId)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {watchlist.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 text-white rounded-lg p-4 shadow-lg"
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
                onClick={() => handleRemoveFromWatchlist(movie.id)}
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:bg-red-400 transition-colors"
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
