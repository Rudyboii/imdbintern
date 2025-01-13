import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard.tsx";

const MovieCarousel = ({ movies }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleMovies = 4;
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  // Autoplay interval ID
  const autoplayInterval = useRef<number | undefined>(undefined);

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleMovies >= movies.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, movies.length - visibleMovies) : prev - 1
    );
  };

  const startDrag = (event) => {
    setIsDragging(true);
    setStartPosition(event.touches ? event.touches[0].clientX : event.clientX);
  };

  const drag = (event) => {
    if (!isDragging) return;
    const currentPosition = event.touches
      ? event.touches[0].clientX
      : event.clientX;
    setCurrentTranslate(prevTranslate + currentPosition - startPosition);
  };

  const endDrag = () => {
    setIsDragging(false);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy > 50) {
      prevSlide();
    } else if (movedBy < -50) {
      nextSlide();
    }

    setPrevTranslate(currentTranslate);
  };

  const autoplay = () => {
    autoplayInterval.current = window.setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval.current !== undefined) {
      clearInterval(autoplayInterval.current);
    }
  };

  useEffect(() => {
    autoplay();
    return () => stopAutoplay(); // Clean up on unmount
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={stopAutoplay}
      onMouseLeave={autoplay}
      onTouchStart={startDrag}
      onTouchMove={drag}
      onTouchEnd={endDrag}
      onMouseDown={startDrag}
      onMouseMove={drag}
      onMouseUp={endDrag}
     
    >
      <div className="overflow-hidden" ref={carouselRef}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (100 / visibleMovies)}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2"
            >
              <Link to={`/movie/${movie.id}`}>
                <MovieCard {...movie} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {movies.length > visibleMovies && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieCarousel;
