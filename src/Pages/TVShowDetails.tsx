import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Edit, Trash } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Autoplay } from "swiper";
import axios from "axios";
import api from "../api";
import MovieReviews from "../components/MovieReviews.tsx";
import {
  Play,
  Tv,
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
  isEditing: boolean;
}
interface TVShow {
  id: number;
  title: string;
  rating: number;
  duration: string;
  genre: string[];
  creator: string;
  description: string;
  image: string;
  backdrop: string | null;
  trailer: string | null;
  cast: CastMember[];
  seasons: string;
  releaseDate: string;
  country: string;
  language: string;
  userRatings: number[];
  reviews: Review[];
  images: string[];
}

const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TVShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [username, setUsername] = useState("");
  const [backdropImages, setBackdropImages] = useState<string[]>([]);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchTVShowDetails = async () => {
      try {
        const { data } = await axios.get(
          `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
        );
        const backdropResponse = await axios.get(
          `${TMDB_BASE_URL}/tv/${id}/images?api_key=${TMDB_API_KEY}`
        );
        const backdropImages = backdropResponse.data.backdrops.map(
          (image: any) =>
            `https://image.tmdb.org/t/p/original${image.file_path}`
        );
        setBackdropImages(backdropImages);
        const tvShowDetails: TVShow = {
          id: data.id,
          title: data.name,
          rating: data.vote_average,
          duration: `${data.episode_run_time[0] || 0} min`,
          genre: data.genres.map((g: any) => g.name),
          creator: data.created_by?.[0]?.name || "Unknown",
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
          seasons: data.number_of_seasons,
          releaseDate: data.first_air_date || "Unknown",
          country: data.origin_country?.[0] || "Unknown",
          language: data.original_language || "Unknown",
          userRatings: [],
          reviews: [],
          images: [],
        };

        setTVShow(tvShowDetails);

        const inWatchlist = await api.isInWatchlist(data.id);
        setIsInWatchlist(inWatchlist);
      } catch (error) {
        console.error("Failed to fetch TV show details:", error);
      }
    };

    fetchTVShowDetails();
  }, [id]);
const MovieDescription = ({ description }) => {
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
  const handleUserRating = (rating: number) => {
    if (!tvShow) return;
    setUserRating(rating);
    setTVShow((prev) =>
      prev
        ? {
            ...prev,
            userRatings: [...prev.userRatings, rating],
          }
        : null
    );
  };

  const calculateUserAverageRating = () => {
    if (!tvShow || tvShow.userRatings.length === 0) return 0;
    const total = tvShow.userRatings.reduce((sum, r) => sum + r, 0);
    return (total / tvShow.userRatings.length).toFixed(1);
  };

  const handleWatchlistToggle = async () => {
    if (!tvShow) return;

    if (isInWatchlist) {
      await api.removeTVShowFromWatchlist(tvShow.id);
    } else {
      await api.addTVShowToWatchlist(tvShow);
    }

    setIsInWatchlist(!isInWatchlist);
  };

  const handleReviewSubmit = () => {
    if (!reviewText || !username) return; 
    if (tvShow) {
      const newReview: Review = {
        username,
        text: reviewText,
        date: new Date().toLocaleDateString(),
        upvotes: 0,
        downvotes: 0,
        isEditing: false,
      };
      setTVShow((prev) =>
        prev ? { ...prev, reviews: [...prev.reviews, newReview] } : null
      );
    }
    setReviewText(""); 
  };

  const sortedReviews = tvShow
    ? tvShow.reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  if (!tvShow) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-navy">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-gray-200">Loading TV Show Details...</span>
      </div>
    );
  }

  return (
    <div>
      {/* TV Show Banner Section */}
      <div
        className="relative h-[90vh]"
        style={{
          backgroundImage: `url(${tvShow.backdrop || tvShow.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="relative container mx-auto h-full flex items-end pb-12 px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex justify-center">
              <img
                src={tvShow.image}
                alt={tvShow.title}
                className="rounded-lg shadow-2xl w-[150px] md:w-[370px]"
              />
            </div>

            <div className="md:col-span-2 text-white space-y-6">
              <h1 className="text-5xl font-bold">{tvShow.title}</h1>

              <MovieDescription description={tvShow.description} />

              <div className="flex items-center space-x-4">
                <a
                  href={`https://www.youtube.com/watch?v=${tvShow.trailer}`}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black px-6 py-3 rounded-lg font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="w-4 h-5" />
                  <span>Watch Trailer</span>
                </a>

               
                <p className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black px-6 py-3 rounded-lg font-semibold">
                  ⭐{tvShow.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop Carousel */}
      <div className="container mx-auto mt-12">
  <Swiper
    spaceBetween={50}
    slidesPerView={1}
    navigation
    autoplay={{ delay: 2500 }}
    modules={[Autoplay, Navigation]}
    onSlideChange={({ realIndex }) => setCurrentImageSlide(realIndex)}
  >
    
    {tvShow.trailer && (
      <SwiperSlide key="trailer">
        <div className="w-full h-[300px] relative">
          <iframe
            src={`https://www.youtube.com/embed/${tvShow.trailer}?autoplay=1`}
            title="Trailer"
            className="w-full h-full rounded-lg shadow-md"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
      </SwiperSlide>
    )}

    
    {backdropImages.map((img, index) => (
      <SwiperSlide key={index}>
        <img
          src={img}
          alt={`Backdrop ${index + 1}`}
          className="w-full h-[300px] object-cover rounded-lg shadow-md"
        />
      </SwiperSlide>
    ))}
  </Swiper>
</div>


      {/* Movie Information */}
      <div className="container mx-auto mt-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Genres</h3>
            <ul className="space-x-4">
              {tvShow.genre.map((g, idx) => (
                <li key={idx} className="text-gray-400">{g}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-6">Creator</h3>
            <p className="text-gray-400">{tvShow.creator}</p>
          </div>

          {/* Release Date, Duration & Language */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Release Date</h3>
            <p className="text-gray-400">{tvShow.releaseDate}</p>

            <h3 className="text-lg font-semibold mt-6">Duration</h3>
            <p className="text-gray-400">{tvShow.duration}</p>

            <h3 className="text-lg font-semibold mt-6">Language</h3>
            <p className="text-gray-400">{tvShow.language}</p>
          </div>

          {/* Country & Seasons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Country</h3>
            <p className="text-gray-400">{tvShow.country}</p>

            <h3 className="text-lg font-semibold mt-6">Seasons</h3>
            <p className="text-gray-400">{tvShow.seasons}</p>
          </div>
        </div>
      </div>
      <div>
      <h1 className="text-3xl font-bold">Movie reviews</h1>
      
      <MovieReviews movieId={tvShow.id} />
    </div>
      {/* Reviews Section */}
      <div className="container mx-auto mt-12">
        <h3 className="text-2xl font-semibold mb-6">Reviews</h3>
        <div className="space-y-4">
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
            <textarea
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full"
            />
            <button
              onClick={handleReviewSubmit}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
            >
              Post Review
            </button>
          </div>

          {sortedReviews.map((review, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{review.username}</span>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-gray-300">{review.text}</p>
              <div className="flex space-x-4 text-gray-400">
                <span className="flex items-center space-x-1">
                  <ThumbsUp size={16} /> {review.upvotes}
                </span>
                <span className="flex items-center space-x-1">
                  <ThumbsDown size={16} /> {review.downvotes}
                </span>
              </div>
              <div className="flex space-x-4 text-gray-400">
                <Edit size={16} />
                <Trash size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
