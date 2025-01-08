import { Search, SlidersHorizontal, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

// Define Movie type
type Movie = {
  id: number;
  title: string;
  rating: number;
  image: string;
  year: number | string;
  genre: number[]; // Use string[] if mapping genre IDs to names
};

const API_KEY =  "734a09c1281680980a71703eb69d9571";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState({ min: 0, max: 10 });
  const [showFilters, setShowFilters] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = search
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
        const response = await axios.get(endpoint);
        const fetchedMovies: Movie[] = response.data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : "N/A",
          genre: movie.genre_ids, // Map to genre names if needed
        }));
        setMovies(fetchedMovies);
      } catch (err) {
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search]);

  const filteredMovies: Movie[] = movies.filter((movie) => {
    const genreMatch =
      genreFilter === "" || movie.genre.includes(parseInt(genreFilter));
    const yearMatch = yearFilter === "" || movie.year === parseInt(yearFilter);
    const ratingMatch =
      movie.rating >= ratingFilter.min && movie.rating <= ratingFilter.max;
    return genreMatch && yearMatch && ratingMatch;
  });

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setGenreFilter(e.target.value);
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setYearFilter(e.target.value);
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRatingFilter((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button
          onClick={toggleFilters}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition"
        >
          <SlidersHorizontal /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">Filters</h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Genre</label>
                <select
                  value={genreFilter}
                  onChange={handleGenreChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                >
                  <option value="">All</option>
                  <option value="28">Action</option>
                  <option value="35">Comedy</option>
                  <option value="18">Drama</option>
                  <option value="10749">Romance</option>
                  <option value="878">Sci-Fi</option>
                  <option value="36">History</option>
                  <option value="80">Crime</option>
                  <option value="99">Documentary</option>
                </select>
              </div>
              {/* Other filters */}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img src={movie.image} alt={movie.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{movie.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">Rating: {movie.rating}</p>
              <p className="text-gray-600 dark:text-gray-400">Year: {movie.year}</p>
              <Link to={`/movies/${movie.id}`} className="mt-4 inline-block text-indigo-500 hover:text-indigo-600">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
