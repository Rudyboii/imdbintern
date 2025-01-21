import React from "react";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; 

const StarRating = ({ initialRating = 0, onRate }: { initialRating?: number, onRate: (rating: number) => void }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (index: number) => {
    setRating(index);
    onRate(index); 
  };

  return (
    <div className="flex items-center">
      {[...Array(10)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <span
            key={starIndex}
            className="cursor-pointer"
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
          >
            {starIndex <= (hoveredRating || rating) ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
