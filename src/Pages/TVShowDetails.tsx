import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Edit, Trash, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Autoplay } from "swiper";
import axios from "axios";
import api from "../api";
import MovieReviews from "../components/MovieReviews.tsx";

const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TVShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tvShow, setTVShow] = useState<any | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [username, setUsername] = useState("");
  const [backdropImages, setBackdropImages] = useState<string[]>([]);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');
  

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
          (image: any) => `https://image.tmdb.org/t/p/original${image.file_path}`
        );
        setBackdropImages(backdropImages);
        const tvShowDetails = {
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
  // Handle user rating
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

  // Handle adding a review
  const handleReviewSubmit = () => {
    if (!reviewText || !username) return;
    if (tvShow) {
      const newReview = {
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

  // Handle upvoting/downvoting reviews
  const handleVote = (reviewId: number, voteType: "upvote" | "downvote") => {
    if (!tvShow) return;
    const updatedReviews = tvShow.reviews.map((review: any) =>
      review.id === reviewId
        ? {
            ...review,
            upvotes: voteType === "upvote" ? review.upvotes + 1 : review.upvotes,
            downvotes: voteType === "downvote" ? review.downvotes + 1 : review.downvotes,
          }
        : review
    );
    setTVShow((prev) => (prev ? { ...prev, reviews: updatedReviews } : null));
  };

  // Handle editing a review
  const handleReviewEdit = (reviewId: number) => {
    const reviewToEdit = tvShow.reviews.find((review: any) => review.id === reviewId);
    if (reviewToEdit) {
      setReviewText(reviewToEdit.text);
      setTVShow((prev) =>
        prev
          ? {
              ...prev,
              reviews: prev.reviews.map((review: any) =>
                review.id === reviewId ? { ...review, isEditing: true } : review
              ),
            }
          : null
      );
    }
  };

  // Handle deleting a review
  const handleReviewDelete = (reviewId: number) => {
    if (!tvShow) return;
    const updatedReviews = tvShow.reviews.filter((review: any) => review.id !== reviewId);
    setTVShow((prev) => (prev ? { ...prev, reviews: updatedReviews } : null));
  };

  // Sort reviews by date or votes
  const sortedReviews = tvShow
    ? tvShow.reviews.sort((a: any, b: any) => {
        if (a.isEditing || b.isEditing) return 0; // Prevent sorting while editing
        if (a.upvotes + a.downvotes !== b.upvotes + b.downvotes) {
          return (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes); // Sort by votes
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // Sort by date
      })
    : [];

  

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
    
  const calculateUserAverageRating = () => {
    if (!tvShow || tvShow.userRatings.length === 0) return 0;
    const total = tvShow.userRatings.reduce((sum, r) => sum + r, 0);
    return (total / tvShow.userRatings.length).toFixed(1);
  };

  

  


  if (!tvShow) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-navy">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-gray-200">Loading TV Show Details...</span>
      </div>
    );
  }

  return (
    <div className="bg-dark-navy">
      {/* TV Show Banner Section */}
      <div
        className="relative h-[90vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${tvShow.backdrop || tvShow.image})`,
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
              <h1 className="text-3xl sm:text-5xl font-bold">{tvShow.title}</h1>

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
      <div className="container mx-auto mt-12 space-y-8">
      <div className="container mx-auto mt-12">
  <div className="grid md:grid-cols-3 gap-8">
    {/* Details Section */}
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Details</h3>
      <ul className="list-none space-y-2 text-gray-400">
        <li><span className="font-medium text-gray-300">Genre:</span> {tvShow.genre.join(", ")}</li>
        <li><span className="font-medium text-gray-300">Duration:</span> {tvShow.duration}</li>
        <li><span className="font-medium text-gray-300">Seasons:</span> {tvShow.seasons}</li>
        <li><span className="font-medium text-gray-300">Release Date:</span> {tvShow.releaseDate}</li>
        <li><span className="font-medium text-gray-300">Language:</span> {tvShow.language}</li>
        <li><span className="font-medium text-gray-300">Country:</span> {tvShow.country}</li>
      </ul>
    </div>

    {/* Top Cast Section */}
    <div className="col-span-2">
      <h2 className="text-3xl font-bold mb-6 text-gray-200">Top Cast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {tvShow.cast.map((actor) => (
          <Link to={`/actor/${actor.id}`} key={actor.id}>
            <div className="bg-[#001F3F] hover:bg-[#003366] transition-all duration-300 rounded-lg shadow-lg overflow-hidden group">
              <img
                src={actor.image}
                alt={actor.name}
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg text-gray-200 group-hover:text-yellow-400">{actor.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{actor.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
</div>


        <div className="bg-[#001F3F] p-6 rounded-lg shadow-lg text-gray-200">
  <h3 className="text-lg font-semibold mb-4">Your Rating (1-10)</h3>
  <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
    {Array.from({ length: 10 }, (_, index) => index + 1).map((num) => (
      <button
        key={num}
        onClick={() => handleUserRating(num)}
        className={`px-3 py-2 rounded-full text-sm ${
          (userRating ?? 0) >= num
            ? "bg-yellow-500 text-black"
            : "bg-gray-700 hover:bg-yellow-400 hover:text-black"
        }`}
      >
        {(userRating ?? 0) >= num ? "★" : "☆"}
      </button>
    ))}
  </div>
  <p className="text-sm mt-4">
    Average User Rating: {calculateUserAverageRating()} / 10
  </p>
</div>

        {/* Reviews Section */}
        <div className="mt-12 space-y-6">
          <h3 className="text-lg font-semibold text-white">Reviews</h3>
          <MovieReviews movieId={tvShow.id} />
        </div>
        {/* Reviews Section */}
      <div className="mt-12 space-y-6">
        <h3 className="text-lg font-semibold text-white">Reviews</h3>
        {sortedReviews.map((review: any) => (
          <div key={review.id} className="bg-[#001F3F] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between">
              <h4 className="text-xl text-yellow-500">{review.username}</h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleVote(review.id, "upvote")}
                  className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, "downvote")}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-400"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{review.downvotes}</span>
                </button>
              </div>
            </div>
            <p className="text-gray-400">{review.text}</p>
            <div className="flex items-center space-x-4 mt-4">
              <button
                onClick={() => handleReviewEdit(review.id)}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-400"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleReviewDelete(review.id)}
                className="flex items-center space-x-2 text-red-500 hover:text-red-400"
              >
                <Trash className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Input */}
      <div className="mt-6 bg-[#001F3F] p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white">Add a Review</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full bg-transparent text-white border-b-2 border-yellow-500 py-2 mt-4"
        />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full bg-transparent text-white border-b-2 border-yellow-500 py-2 mt-4"
          rows={4}
        />
        <button
          onClick={handleReviewSubmit}
          className="mt-4 px-8 py-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black rounded-lg font-semibold"
        >
          Submit Review
        </button>
      </div>
    </div>
      </div>
    
  );
};

export default TVShowDetails;
