import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import api from "../api"; // Import the mock API
import {
  Play,
  Film,
  Calendar,
  DollarSign,
  Star,
  Globe,
  Clock,
  Languages,
} from "lucide-react";
import { FaPlay } from 'react-icons/fa';


interface CastMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface Movie {
  id: number;
  title: string;
  rating: number;
  duration: string;
  genre: string[];
  director: string;
  description: string;
  image: string;
  backdrop: string | null;
  trailer: string | null;
  cast: CastMember[];
  boxOffice: string;
  releaseDate: string;
  country: string;
  language: string;
}

const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const { data } = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
        );

        const movieDetails: Movie = {
          id: data.id,
          title: data.title,
          rating: data.vote_average,
          duration: `${data.runtime || 0} min`,
          genre: data.genres.map((g: any) => g.name),
          director:
            data.credits?.crew?.find((c: any) => c.job === "Director")?.name ||
            "Unknown",
          description: data.overview || "No description available.",
          image: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : "/placeholder-image.jpg",
          backdrop: data.backdrop_path
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : null,
          cast: data.credits?.cast
            ? data.credits.cast.slice(0, 8).map((c: any) => ({
                id: c.id,
                name: c.name,
                role: c.character,
                image: c.profile_path
                  ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                  : "/placeholder-profile.jpg",
              }))
            : [],
          trailer:
            data.videos?.results?.find((v: any) => v.type === "Trailer")?.key ||
            null,
          boxOffice: data.revenue
            ? `$${(data.revenue / 1e6).toFixed(1)}M`
            : "N/A",
          releaseDate: data.release_date || "Unknown",
          country: data.production_countries?.[0]?.name || "Unknown",
          language: data.original_language || "Unknown",
        };

        setMovie(movieDetails);

        // Check if the movie is already in the watchlist
        const inWatchlist = await api.isInWatchlist(data.id);
        setIsInWatchlist(inWatchlist);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleWatchlistToggle = async () => {
    if (!movie) return;

    if (isInWatchlist) {
      await api.removeMovieFromWatchlist(movie.id);
    } else {
      await api.addMovieToWatchlist(movie);
    }

    setIsInWatchlist(!isInWatchlist);
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-navy">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-gray-200">Loading Movie Details...</span>
      </div>
    );
  }

  return (
    <div
  className="relative h-[90vh]"
  style={{
    backgroundImage: `url(${movie.backdrop || movie.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
  
  <div className="relative container mx-auto h-full flex items-end pb-12 px-6 md:px-12">
    <div className="grid md:grid-cols-3 gap-12">
            {/* Movie Poster */}
      <div className="flex justify-center">
        <img
          src={movie.image}
          alt={movie.title}
          className="rounded-lg shadow-2xl w-[150px] md:w-[470px]"
        />
      </div>

      {/* Movie Details */}
      <div className="md:col-span-2 text-white space-y-6">
        <h1 className="text-5xl font-bold">{movie.title}</h1>
        
        <p className="text-gray-300 text-lg">{movie.description}</p>
        
        <div className="flex items-center space-x-4">
          {/* Watch Trailer Button */}
          <a
            href={`https://www.youtube.com/watch?v=${movie.trailer}`}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black px-6 py-3 rounded-lg font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Play className="w-5 h-5" />
            <span>Watch Trailer</span>
          </a>
          
          {/* Watchlist Toggle Button */}
          <button
            onClick={handleWatchlistToggle}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isInWatchlist
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        </div>
      </div>
    
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Movie Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Movie Details Icons */}
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Film className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Director</p>
              <p>{movie.director}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Calendar className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Release Date</p>
              <p>{movie.releaseDate}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <DollarSign className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Box Office</p>
              <p>{movie.boxOffice}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Star className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Genre</p>
              <p>{movie.genre.join(", ")}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Languages className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Language</p>
              <p>{movie.language}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Globe className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Country</p>
              <p>{movie.country}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Clock className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Runtime</p>
              <p>{movie.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="container mx-auto mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Top Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {movie.cast.map((actor) => (
            <Link to={`/actor/${actor.id}`} key={actor.id}>
              <div className="bg-[#001F3F] hover:bg-[#003366] transition-all duration-300 rounded-lg shadow-lg overflow-hidden group">
                <img
                  src={actor.image}
                  alt={actor.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-gray-200 group-hover:text-yellow-400">
                    {actor.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{actor.role}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
