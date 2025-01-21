import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Edit, Trash } from 'lucide-react';

type Review = {
  id: number;
  username: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
};

type Props = {
  movieId: number;
};

const ReviewComponent: React.FC<Props> = ({ movieId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [username, setUsername] = useState('');
  const [editReviewId, setEditReviewId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'recent' | 'helpful'>('recent');

  const handleReviewSubmit = () => {
    if (!username || !reviewText) {
      alert('Please enter both your name and review!');
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      username,
      content: reviewText,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    };

    setReviews((prevReviews) => [...prevReviews, newReview]);
    setReviewText('');
    setUsername('');
  };

  const handleVote = (id: number, type: 'upvote' | 'downvote') => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              upvotes: type === 'upvote' ? review.upvotes + 1 : review.upvotes,
              downvotes: type === 'downvote' ? review.downvotes + 1 : review.downvotes,
            }
          : review
      )
    );
  };

  const handleReviewEdit = (id: number) => {
    const reviewToEdit = reviews.find((review) => review.id === id);
    if (reviewToEdit) {
      setUsername(reviewToEdit.username);
      setReviewText(reviewToEdit.content);
      setEditReviewId(id); 
    }
  };

  const handleReviewDelete = (id: number) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
  };

  const handleSortChange = (option: 'recent' | 'helpful') => {
    setSortOption(option);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'recent') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      return b.upvotes - a.upvotes; 
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">USER Reviews</h2>

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

      {/* Sort Buttons */}
      <div className="mb-6 text-center">
        <button
          className="mx-2 bg-gray-200 py-1 px-4 rounded-md hover:bg-gray-300 transition"
          onClick={() => handleSortChange('recent')}
        >
          Sort by Most Recent
        </button>
        <button
          className="mx-2 bg-gray-200 py-1 px-4 rounded-md hover:bg-gray-300 transition"
          onClick={() => handleSortChange('helpful')}
        >
          Sort by Most Helpful
        </button>
      </div>

      {/* Reviews List */}
      <div className="mt-12 space-y-6">
        <h3 className="text-lg font-semibold text-white">Reviews</h3>
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-[#001F3F] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between">
              <h4 className="text-xl text-yellow-500">{review.username}</h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleVote(review.id, 'upvote')}
                  className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, 'downvote')}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-400"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{review.downvotes}</span>
                </button>
              </div>
            </div>
            <p className="text-gray-400">{review.content}</p>
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
    </div>
  );
};

export default ReviewComponent;
