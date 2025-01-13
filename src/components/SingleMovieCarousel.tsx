import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const SingleMovieCarousel = ({ movie }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const autoplayInterval = useRef<number | undefined>(undefined);

  const items = [
    { type: "trailer", content: movie.trailer }, // The trailer is the first item
    ...movie.images.map((image) => ({ type: "image", content: image })), // Movie images
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 1 >= items.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? items.length - 1 : prev - 1
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
    return () => stopAutoplay();
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
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
            >
              {item.type === "trailer" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${item.content}`}
                  title="Movie Trailer"
                  className="w-full h-64 md:h-80 rounded-md shadow-lg"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  src={item.content}
                  alt={`Movie Image ${index}`}
                  className="w-full h-64 md:h-80 object-cover rounded-md shadow-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default SingleMovieCarousel;
