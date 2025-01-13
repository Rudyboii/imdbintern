import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TMDB_API_KEY = "734a09c1281680980a71703eb69d9571"; // Replace with your TMDB API key

interface ImageCarouselProps {
    Id: number;
    title: string; }

const ImageCarousel = ({ movieId }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch movie images
  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        
        // Log the response to check the data structure
        console.log("API Response:", data);

        // Check if backdrops are available, otherwise use posters
        if (data.images && data.images.backdrops.length > 0) {
          const fetchedImages = data.images.backdrops.map(
            (image) => `https://image.tmdb.org/t/p/original${image.file_path}`
          );
          setImages(fetchedImages);
        } else if (data.images && data.images.posters.length > 0) {
          // Fallback to posters if no backdrops
          const fetchedImages = data.images.posters.map(
            (image) => `https://image.tmdb.org/t/p/original${image.file_path}`
          );
          setImages(fetchedImages);
        } else {
          console.error("No images or posters found for this movie.");
        }
      } catch (error) {
        console.error("Error fetching movie images:", error);
      }
    };

    fetchMovieImages();
  }, [movieId]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full group">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${images.length * 100}%`,
          }}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="flex-shrink-0 w-full h-64 md:h-80">
                <img
          src={image}
          alt={movieId.title}
          className="w-full h-full object-cover hover:opacity-90 transition-all duration-300 ease-in-out"
          loading="lazy"
        />
              </div>
            ))
          ) : (
            <div className="flex-shrink-0 w-full h-64 md:h-80 flex justify-center items-center bg-gray-200">
              <span>No images available</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots for Indicator */}
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full mx-1 ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};



export default ImageCarousel;
