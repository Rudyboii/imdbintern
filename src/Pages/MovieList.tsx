import { Search, SlidersHorizontal, Star } from "lucide-react";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const MovieList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState({ min: 0, max: 10 });

  const Movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      rating: 8.8,
      image:
        "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      year: 2024,
      genre: ["Action", "Adventure", "Sci-Fi"],
    },
    {
      id: 2,
      title: "Poor Things",
      rating: 8.4,
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      year: 2023,
      genre: ["Comedy", "Drama", "Romance"],
    },
    {
      id: 3,
      title: "Oppenheimer",
      rating: 8.9,
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
      year: 2023,
      genre: ["Biography", "Drama", "History"],
    },
    {
      id: 4,
      title: "The Batman",
      rating: 8.5,
      image:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
      year: 2024,
      genre: ["Action", "Crime", "Drama"],
    },
    {
      id: 5,
      title: "Killers of the Flower Moon",
      rating: 8.7,
      image:
        "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
      year: 2023,
      genre: ["Crime", "Drama", "History"],
    },
  ];

  const filteredMovies = Movies.filter((movie) => {
    const genreMatch = genreFilter === "" || movie.genre.includes(genreFilter);
    const yearMatch = yearFilter === "" || movie.year === parseInt(yearFilter);
    const ratingMatch =
      movie.rating >= ratingFilter.min && movie.rating <= ratingFilter.max;
    return genreMatch && yearMatch && ratingMatch;
  });

  const handleGenreChange = (e) => setGenreFilter(e.target.value);
  const handleYearChange = (e) => setYearFilter(e.target.value);
  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingFilter((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition">
          <SlidersHorizontal /> Filters
        </button>
      </div>

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
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Biography">Biography</option>
                <option value="Crime">Crime</option>
                <option value="History">History</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Year</label>
              <input
                type="number"
                value={yearFilter}
                onChange={handleYearChange}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                placeholder="Enter year"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Rating Range</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="min"
                  value={ratingFilter.min}
                  onChange={handleRatingChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                  placeholder="Min"
                />
                <input
                  type="number"
                  name="max"
                  value={ratingFilter.max}
                  onChange={handleRatingChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 lg:col-span-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <img src={movie.image} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {movie.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Rating: {movie.rating}</p>
                <p className="text-gray-600 dark:text-gray-400">Year: {movie.year}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Genre: {movie.genre.join(", ")}
                </p>
                <Link
                  to={`/movies/${movie.id}`}
                  className="mt-4 inline-block text-indigo-500 hover:text-indigo-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
