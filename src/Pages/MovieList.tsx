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

  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
  };

  const handleYearChange = (e) => {
    setYearFilter(e.target.value);
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingFilter((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {search ? `Search Results for "${search}` : "Popular Movies"}
        </h1>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors">
          <SlidersHorizontal /> Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-gray-900 rounded-xl p-4">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 mb-2">Genre</label>
              <select
                value={genreFilter}
                onChange={handleGenreChange}
                className="bg-gray-800 text-white p-2 rounded-lg"
              >
                <option value="">All</option>
                <option value="Action">Action</option>
                <option value=" Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Biography">Biography</option>
                <option value="Crime">Crime</option>
                <option value="History">History</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 mb-2">Year</label>
              <input
                type="number"
                value={yearFilter}
                onChange={handleYearChange}
                className="bg-gray-800 text-white p-2 rounded-lg"
                placeholder="Enter year"
              />
            </div>

            <div>
              <label className="text-gray-400 mb-2">Rating Range</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="min"
                  value={ratingFilter.min}
                  onChange={handleRatingChange}
                  className="bg-gray-800 text-white p-2 rounded-lg"
                  placeholder="Min"
                />
                <input
                  type="number"
                  name="max"
                  value={ratingFilter.max}
                  onChange={handleRatingChange}
                  className="bg-gray-800 text-white p-2 rounded-lg"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
              <img src={movie.image} alt={movie.title} className="rounded-lg mb-2" />
              <h3 className="text-xl font-semibold">{movie.title}</h3>
              <p className="text-gray-400">Rating: {movie.rating}</p>
              <p className="text-gray-400">Year: {movie.year}</p>
              <p className="text-gray-400">Genre: {movie.genre.join(", ")}</p>
              <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;