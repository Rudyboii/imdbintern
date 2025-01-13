import { Star } from "lucide-react";
import React from "react";

const MovieCard = ({
  title = "Untitled",
  rating = 0,
  userRating = null,
  image = "https://via.placeholder.com/300x450?text=No+Image",
  year = "Unknown",
  genre = [],
}) => {
  // Calculate average rating
  const averageRating = userRating
    ? ((rating + userRating) / 2).toFixed(1)
    : rating.toFixed(1);

  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden backdrop-blur-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      {/* Image Section */}
      <div className="relative aspect-[2/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:opacity-90 transition-all duration-300 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <div className="absolute bottom-0 p-4 w-full">
            <button 
              className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
              aria-label={`View details for ${title}`}
            >
              View Details
            </button>
          </div>
        </div>
        {/* Average Rating */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-yellow-500 font-medium">{averageRating}</span>
          </div>
          <span className="text-xs text-zinc-400">(Avg)</span>
        </div>
      </div>
      {/* Title, Year, and Genre */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-glow text-white truncate">{title}</h3>
          <span className="text-zinc-400 text-sm">{year}</span>
        </div>
        {genre.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {genre.slice(0, 2).map((g, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300 transition-colors duration-200 hover:bg-yellow-500 hover:text-black"
              >
                {g}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic">No genres available</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
