import { Star, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  title: string;
  rating: number;
  image: string;
  year: number;
  votes: string;
  rank: number;
}

const Toprated: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        const { data } = await axios.get(
          `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
        );

        const formattedMovies = data.results.slice(0, 10).map((movie: any, index: number) => ({
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          year: new Date(movie.release_date).getFullYear(),
          votes: `${(movie.vote_count / 1e6).toFixed(1)}M`, 
          rank: index + 1,
        }));

        setMovies(formattedMovies);
      } catch (error) {
        console.error("Failed to fetch top-rated movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <span className="ml-4">Loading Top-Rated Movies...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Top Rated Movies</h1>
      </motion.div>
      <div className="space-y-6">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/movie/${movie.id}`}>
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex">
                  <div className="w-16 bg-yellow-500 flex items-center justify-center text-black font-bold text-xl">
                    #{movie.rank}
                  </div>
                  <div className="relative w-48">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {movie.title}
                      </h2>
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-200">
                      <span>{movie.year}</span>
                      <span className="mx-2">•</span>
                      <span>{movie.votes} votes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Toprated;
