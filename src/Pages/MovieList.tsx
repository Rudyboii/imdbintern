import { SlidersHorizontal, Grid, List, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define Media type
type Media = {
  id: number;
  title: string;
  type: "movie" | "tv";
  rating: number;
  image: string;
  year: number | string;
  genre: number[];
  description: string;
};

const API_KEY = "734a09c1281680980a71703eb69d9571";
const BASE_URL = "https://api.themoviedb.org/3";

const MediaList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState({ min: 0, max: 10 });
  const [showFilters, setShowFilters] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoints = search
          ? [
              `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`,
              `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${search}`,
            ]
          : [
              `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
              `${BASE_URL}/tv/popular?api_key=${API_KEY}`,
            ];

        const [moviesResponse, tvResponse] = await Promise.all(
          endpoints.map((endpoint) => axios.get(endpoint))
        );

        const fetchedMovies: Media[] = moviesResponse.data.results.map(
          (item: any) => ({
            id: item.id,
            title: item.title,
            type: "movie",
            rating: item.vote_average,
            image: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image",
            year: item.release_date
              ? parseInt(item.release_date.split("-")[0])
              : "N/A",
            genre: item.genre_ids,
            description: item.overview || "No description available.",
          })
        );

        const fetchedTVShows: Media[] = tvResponse.data.results.map(
          (item: any) => ({
            id: item.id,
            title: item.name,
            type: "tv",
            rating: item.vote_average,
            image: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image",
            year: item.first_air_date
              ? parseInt(item.first_air_date.split("-")[0])
              : "N/A",
            genre: item.genre_ids,
            description: item.overview || "No description available.",
          })
        );

        setMedia([...fetchedMovies, ...fetchedTVShows]);
      } catch (err) {
        setError("Failed to fetch media. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [search]);

  const filteredMedia: Media[] = media.filter((item) => {
    const genreMatch =
      genreFilter === "" || item.genre.includes(parseInt(genreFilter));
    const yearMatch = yearFilter === "" || item.year === parseInt(yearFilter);
    const ratingMatch =
      item.rating >= ratingFilter.min && item.rating <= ratingFilter.max;
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
  const clearFilters = () => {
    setGenreFilter("");
    setYearFilter("");
    setRatingFilter({ min: 0, max: 10 });
  };

  const toggleView = () =>
    setView((prev) => (prev === "grid" ? "list" : "grid"));

  const handleMediaClick = (id: number, type: "movie" | "tv") => {
    navigate(`/${type}/${id}`);
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center py-4">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          {search ? `Search Results for "${search}"` : "Popular Media"}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-lg shadow-lg hover:opacity-90 transition-all"
          >
            <SlidersHorizontal /> Filters
          </button>
          <button
            onClick={toggleView}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 px-5 py-2 rounded-lg shadow-lg hover:opacity-90 transition-all"
          >
            {view === "grid" ? <List /> : <Grid />}{" "}
            {view === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className={`transition-all duration-300 transform ${
          showFilters ? "max-h-full opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg`}
      >
        <div className="flex justify-between mb-6">
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            <X className="inline mr-2" /> Clear Filters
          </button>
        </div>

        {/* Genre Filter */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Genre
          </label>
          <select
            value={genreFilter}
            onChange={handleGenreChange}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Genres</option>
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
            <option value="10751">Family</option>
            <option value="14">Fantasy</option>
            <option value="36">History</option>
            <option value="10762">Kids</option>
            <option value="10402">Music</option>
            <option value="10749">Romance</option>
            <option value="878">Science Fiction</option>
            <option value="10770">TV Movie</option>
            <option value="53">Thriller</option>
            <option value="10752">War</option>
            <option value="37">Western</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Year
          </label>
          <input
            type="number"
            min="1900"
            max="2025"
            value={yearFilter}
            onChange={handleYearChange}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Rating
          </label>
          <input
            type="range"
            name="min"
            min="0"
            max="10"
            value={ratingFilter.min}
            onChange={handleRatingChange}
            className="w-full h-2 bg-purple-300 rounded-lg focus:outline-none"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {ratingFilter.min} - {ratingFilter.max}
          </span>
        </div>
      </div>

      {/* Display Media */}
      <div
        className={
          view === "grid"
            ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-6"
        }
      >
        {filteredMedia.map((item) =>
          view === "grid" ? (
            <div
              key={item.id}
              onClick={() => handleMediaClick(item.id, item.type)}
              className="relative bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden group hover:scale-105 transform transition cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-60 object-cover opacity-80 group-hover:opacity-100 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-100 transition p-4">
                <h3 className="text-lg font-bold">
                  {item.title}{" "}
                  <span className="text-sm font-normal">
                    ({item.type === "movie" ? "Movie" : "TV Show"})
                  </span>
                </h3>
                <p className="text-sm">Rating: {item.rating}</p>
                <p className="text-sm">Year: {item.year}</p>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              onClick={() => handleMediaClick(item.id, item.type)}
              className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-28 h-40 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}{" "}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    ({item.type === "movie" ? "Movie" : "TV Show"})
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Rating: {item.rating}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Year: {item.year}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MediaList;
