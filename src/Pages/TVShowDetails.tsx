// TVShowDetails.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination, Autoplay } from "swiper";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571";

interface TVShow {
  id: number;
  title: string;
  rating: number;
  duration: string;
  genre: string[];
  director: string;
  description: string;
  image: string;
  
  trailer: string;
  releaseDate: string;
  country: string;
  language: string;
  userRatings: any[];
  reviews: any[];
  images: string[];
}

const TVShowDetails: React.FC = () => {
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [backdropImages, setBackdropImages] = useState<string[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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

        const tvShowDetails: TVShow = {
          id: data.id,
          title: data.name,
          rating: data.vote_average,
          duration: `${data.episode_run_time[0]} min`,
          genre: data.genres.map((g: any) => g.name),
          director:
            data.credits?.crew?.find((c: any) => c.job === "Director")?.name ||
            "Unknown",
          description: data.overview || "No description available.",
          image: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : "/placeholder-image.jpg",
          
          trailer:
            data.videos?.results?.find((v: any) => v.type === "Trailer")?.key ||
            null,
          releaseDate: data.first_air_date || "Unknown",
          country: data.production_countries?.[0]?.name || "Unknown",
          language: data.original_language || "Unknown",
          userRatings: [],
          reviews: [],
          images: [], // This can remain empty since we're using backdropImages
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

  return (
    <div>
      {tvShow && (
        <div>
          <h1 className="text-3xl font-bold">{tvShow.title}</h1>
          <p className="text-lg font-medium">{tvShow.description}</p>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img
                className="w-20 h-20 object-cover rounded-lg"
                src={tvShow.image}
                alt={tvShow.title}
              />
              <div>
                <h2 className="text-lg font-bold">{tvShow.title}</h2>
                <p className="text-sm text-gray-600">
                  {tvShow.releaseDate} | {tvShow.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsInWatchlist(!isInWatchlist)}
              >
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            onSlideChange={(swiper) => setCurrentImageSlide(swiper.activeIndex)}
          >
            {backdropImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Backdrop ${index + 1}`}
                  className="w-full h-60 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default TVShowDetails;
