import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Edit, Trash } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import { Navigation, Pagination, Autoplay } from "swiper"; // Optional modules
import { Carousel } from "react-bootstrap";
import axios from "axios";
import api from "../api";
import {
  Play,
  Film,
  Calendar,
  DollarSign,
  Globe,
  Clock,
  Languages,
  Star,
} from "lucide-react";
interface CastMember {
  id: number;
  name: string;
  role: string;
  image: string;
}
interface Review {
  username: string;
  text: string;
  date: string;
  upvotes: number;
  downvotes: number;
  isEditing: boolean; // Whether the review is being edited
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
  userRatings: number[]; // Store user ratings
  reviews: Review[]; // Store user reviews
  images: string[];
}
const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null); // Track user rating (1-10)
  const [reviewText, setReviewText] = useState(""); // Review text input
  const [username, setUsername] = useState(""); // Review username input
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortOption, setSortOption] = useState<"mostHelpful" | "mostRecent">(
    "mostRecent"
  );
  const [backdropImages, setBackdropImages] = useState<string[]>([]);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  useEffect(() => {
    if (!id) return;
    const fetchMovieDetails = async () => {
      try {
        const { data } = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
        );
        const backdropResponse = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}/images?api_key=${TMDB_API_KEY}`
        );
        const backdropImages = backdropResponse.data.backdrops.map(
          (image: any) =>
            `https://image.tmdb.org/t/p/original${image.file_path}`
        );
        setBackdropImages(backdropImages);
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
          userRatings: [], // Initialize user ratings
          reviews: [],
          images: [],
        };

        setMovie(movieDetails);

        const inWatchlist = await api.isInWatchlist(data.id);
        setIsInWatchlist(inWatchlist);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);
  const handleUserRating = (rating: number) => {
    if (!movie) return;
    setUserRating(rating);
    setMovie((prev) =>
      prev
        ? {
            ...prev,
            userRatings: [...prev.userRatings, rating],
          }
        : null
    );
  };
  const calculateUserAverageRating = () => {
    if (!movie || movie.userRatings.length === 0) return 0;
    const total = movie.userRatings.reduce((sum, r) => sum + r, 0);
    return (total / movie.userRatings.length).toFixed(1);
  };
  const handleWatchlistToggle = async () => {
    if (!movie) return;

    if (isInWatchlist) {
      await api.removeMovieFromWatchlist(movie.id);
    } else {
      await api.addMovieToWatchlist(movie);
    }

    setIsInWatchlist(!isInWatchlist);
  };

  const handleReviewSubmit = () => {
    if (!reviewText || !username) return; // Prevent empty reviews or missing usernames
    if (movie) {
      const newReview: Review = {
        username,
        text: reviewText,
        date: new Date().toLocaleDateString(),
        upvotes: 0,
        downvotes: 0,
        isEditing: false,
      };
      setMovie((prev) =>
        prev ? { ...prev, reviews: [...prev.reviews, newReview] } : null
      );
    }
    setReviewText(""); // Clear review text after submission
  };
  const handleReviewEdit = (index: number) => {
    setMovie((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.map((review, idx) =>
              idx === index ? { ...review, isEditing: true } : review
            ),
          }
        : null
    );
  };
  const handleReviewSave = (index: number, newText: string) => {
    setMovie((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.map((review, idx) =>
              idx === index
                ? { ...review, text: newText, isEditing: false }
                : review
            ),
          }
        : null
    );
  };
  const handleReviewDelete = (index: number) => {
    setMovie((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.filter((_, idx) => idx !== index),
          }
        : null
    );
  };
  const handleUpvote = (index: number) => {
    setMovie((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.map((review, idx) =>
              idx === index
                ? { ...review, upvotes: review.upvotes + 1 }
                : review
            ),
          }
        : null
    );
  };
  const handleDownvote = (index: number) => {
    setMovie((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.map((review, idx) =>
              idx === index
                ? { ...review, downvotes: review.downvotes + 1 }
                : review
            ),
          }
        : null
    );
  };const MovieDescription = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const wordLimit = 30;
    const words = description.split(" ");
    const truncatedDescription = words.slice(0, wordLimit).join(" ");
    return (
      <div>
        <p className="text-gray-300 text-lg">
          {isExpanded ? description : `${truncatedDescription}...`}
        </p>
        {words.length > wordLimit && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-yellow-500 hover:text-yellow-600 font-semibold mt-2"
          >
            {isExpanded ? "View Less" : "View More"}
          </button>
        )}
      </div>
    );
  };
  const sortedReviews = movie
    ? movie.reviews.sort((a, b) => {
        if (sortOption === "mostHelpful") {
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
    : [];
    

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-navy">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-gray-200">Loading Movie Details...</span>
      </div>
    );
  }
  const fetchMovieImages = async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}/images`);
    return response.data.backdrops; // This will return an array of images
  };

  return (
    <div>
      {/* Movie Banner Section */}
      <div
        className="relative h-[90vh]"
        style={{
          backgroundImage: `url(${movie.backdrop || movie.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="relative container mx-auto h-full flex items-end pb-12 px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex justify-center">
              <img
                src={movie.image}
                alt={movie.title}
                className="rounded-lg shadow-2xl w-[150px] md:w-[370px]"
              />
            </div>

            <div className="md:col-span-2 text-white space-y-6">
  <h1 className="text-5xl font-bold">{movie.title}</h1>

  <MovieDescription description={movie.description} />

  <div className="flex items-center space-x-4">
    <a
      href={`https://www.youtube.com/watch?v=${movie.trailer}`}
      className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black px-6 py-3 rounded-lg font-semibold"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Play className="w-4 h-5" />
      <span>Watch Trailer</span>
    </a>

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
    <p className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black px-6 py-3 rounded-lg font-semibold">
      ⭐{movie.rating.toFixed(1)} / 10
    </p>
  </div>
</div>
          </div>
        </div>
      </div>
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] mb-8">
  <Swiper
    modules={[Navigation, Autoplay]}
    spaceBetween={15}
    slidesPerView={1}
    breakpoints={{
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    }}
    navigation={{
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    }}
    autoplay={{ delay: 3000 }}
    onSlideChange={(swiper) => setCurrentImageSlide(swiper.activeIndex)}
    className="mt-4"
  >
    {movie.trailer && (
      <SwiperSlide key="trailer">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${movie.trailer}`}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </SwiperSlide>
    )}
    {backdropImages.map((image, index) => (
      <SwiperSlide key={index}>
        <div className="relative">
          <img
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out hover:scale-105"
            src={image}
            alt={`Backdrop ${index}`}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>


      {/* Movie Info Section */}
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Movie Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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
              <p className="text-lg font-bold">Duration</p>
              <p>{movie.duration}</p>
            </div>
          </div>
          <div className="bg-[#001F3F] p-4 rounded-lg shadow-md flex items-center gap-4">
            <Languages className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-lg font-bold">Language</p>
              <p>{movie.language}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Rating Section */}
      <div className="container mx-auto mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">
          Rate This Movie
        </h2>
        <div className="bg-[#001F3F] p-6 rounded-lg shadow-lg text-gray-200">
          <h3 className="text-lg font-semibold mb-4">Your Rating (1-10)</h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => handleUserRating(num)}
                className={`px-3 py-2 rounded-full text-sm ${
                  userRating === num
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-sm mt-4">
            Average User Rating: {calculateUserAverageRating()} / 10
          </p>
        </div>
      </div>
      {/* Movie Cast Section */}
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
      {/* Reviews and User Rating */}
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
        {/* Sorting Options */}
        <div className="mb-4">
          <button
            onClick={() => setSortOption("mostHelpful")}
            className={`px-4 py-2 rounded-lg ${
              sortOption === "mostHelpful" ? "bg-yellow-500" : "bg-gray-700"
            }`}
          >
            Most Helpful
          </button>
          <button
            onClick={() => setSortOption("mostRecent")}
            className={`px-4 py-2 ml-2 rounded-lg ${
              sortOption === "mostRecent" ? "bg-yellow-500" : "bg-gray-700"
            }`}
          >
            Most Recent
          </button>
        </div>
        <div className="space-y-4">
          {sortedReviews.map((review, idx) => (
            <div key={idx} className="bg-[#001F3F] p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">{review.username}</p>
              <p className="text-sm text-gray-400">{review.date}</p>
              {/* Editing Review */}
              {review.isEditing ? (
                <div>
                  <textarea
                    value={review.text}
                    onChange={(e) => handleReviewSave(idx, e.target.value)}
                    className="w-full p-2 rounded-md"
                  />
                  <button
                    onClick={() => handleReviewSave(idx, review.text)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold mt-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="mt-2">{review.text}</p>
              )}
              {/* Review Actions */}
              <div className="flex items-center mt-2 space-x-4">
                <button
                  onClick={() => handleUpvote(idx)}
                  className="text-yellow-400 flex items-center space-x-2"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Upvote ({review.upvotes})</span>
                </button>

                <button
                  onClick={() => handleDownvote(idx)}
                  className="text-red-400 flex items-center space-x-2"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>Downvote ({review.downvotes})</span>
                </button>

                <button
                  onClick={() => handleReviewEdit(idx)}
                  className="text-yellow-400 flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleReviewDelete(idx)}
                  className="text-red-400 flex items-center space-x-2"
                >
                  <Trash className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold">Add Your Review</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-md text-gray-900 dark:text-gray-100 bg-gray-800 dark:bg-gray-900 border border-gray-600 dark:border-gray-400"
            />

            <textarea
              placeholder="Write your review here"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-2 rounded-md text-gray-900 dark:text-gray-100 bg-gray-800 dark:bg-gray-900 border border-gray-600 dark:border-gray-400"
            />
            <button
              onClick={handleReviewSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
