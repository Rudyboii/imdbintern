import { Search, SlidersHorizontal, Star, Grid, List } from "lucide-react";
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
  genre: number[];
  description: string;
};

const API_KEY = "734a09c1281680980a71703eb69d9571";
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
  const [view, setView] = useState<"grid" | "list">("grid");

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
          genre: movie.genre_ids,
          description: movie.overview || "No description available.",
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

  const toggleView = () => setView((prev) => (prev === "grid" ? "list" : "grid"));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            <SlidersHorizontal /> Filters
          </button>
          <button
            onClick={toggleView}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            {view === "grid" ? <List /> : <Grid />} {view === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col gap-4">
            <label className="block text-gray-700 dark:text-gray-300">Genre</label>
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
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-gray-700 dark:text-gray-300">Year</label>
            <input
              type="number"
              value={yearFilter}
              onChange={handleYearChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
              placeholder="Year"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-gray-700 dark:text-gray-300">Rating Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="min"
                value={ratingFilter.min}
                onChange={handleRatingChange}
                className="w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                placeholder="Min"
              />
              <span className="text-gray-700 dark:text-gray-300">to</span>
              <input
                type="number"
                name="max"
                value={ratingFilter.max}
                onChange={handleRatingChange}
                className="w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      )}

      <div className={view === "grid" ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}>
        {filteredMovies.map((movie) =>
          view === "grid" ? (
            <div
              key={movie.id}
              className="relative bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden group hover:scale-105 transform transition"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-60 object-cover opacity-80 group-hover:opacity-100 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-100 transition p-4">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-sm">Rating: {movie.rating}</p>
                <p className="text-sm">Year: {movie.year}</p>
              </div>
            </div>
          ) : (
            <div
              key={movie.id}
              className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-28 h-40 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {movie.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Rating: {movie.rating}</p>
                <p className="text-gray-600 dark:text-gray-400">Year: {movie.year}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {movie.description}
                </p>
                <Link
                  to={`/movies/${movie.id}`}
                  className="mt-2 inline-block text-indigo-500 hover:text-indigo-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MovieList;
