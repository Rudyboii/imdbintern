import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface Review {
  author: string;
  content: string;
  id: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
}

const MovieReviews = ({
  movieId,
  isTVShow = false, 
}: {
  movieId: number;
  isTVShow?: boolean;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("most_recent");
  const [page, setPage] = useState<number>(1);
  const [reviewsPerPage] = useState<number>(5);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${isTVShow ? "tv" : "movie"}/${movieId}/reviews`,
          {
            params: {
              api_key: "734a09c1281680980a71703eb69d9571",
              language: "en-US",
              page,
            },
          }
        );

        const reviewsWithVotes = response.data.results.map((review: any) => ({
          ...review,
          upvotes: 0,
          downvotes: 0,
        }));

        setReviews((prevReviews) => [
          ...prevReviews,
          ...reviewsWithVotes,
        ]);
      } catch (error) {
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, page, isTVShow]); 

  // Handle upvote/downvote
  const handleVote = (reviewId: string, type: "upvote" | "downvote") => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              upvotes: type === "upvote" ? review.upvotes + 1 : review.upvotes,
              downvotes:
                type === "downvote" ? review.downvotes + 1 : review.downvotes,
            }
          : review
      )
    );
  };

  const sortReviews = (reviews: Review[]) => {
    if (sortOption === "most_helpful") {
      return reviews.sort(
        (a, b) =>
          b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
    } else {
      return reviews.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() 
      );
    }
  };

 
  const reviewsToShow = sortReviews(reviews).slice(0, page * reviewsPerPage);

  if (loading) return <div>Loading reviews...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4">Movie/TV Show Reviews</h2>

      {/* Sorting options */}
      <div className="mb-4">
        <button
          onClick={() => setSortOption("most_helpful")}
          className="mr-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Most Helpful
        </button>
        <button
          onClick={() => setSortOption("most_recent")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Most Recent
        </button>
      </div>

      {reviewsToShow.length === 0 ? (
        <p>No reviews available for this {isTVShow ? "TV show" : "movie"}.</p>
      ) : (
        <div>
          
          {reviewsToShow.map((review) => (
            <div key={review.id} className="mb-6 p-4 border rounded-lg">
              <div className="mb-2">
                <h3 className="font-semibold text-lg">{review.author}</h3>
                <p className="text-sm text-gray-600">{review.created_at}</p>
              </div>
              <p>{review.content}</p>

              {/* Upvote/Downvote buttons */}
              <div className="mt-2">
                <button
                  onClick={() => handleVote(review.id, "upvote")}
                  className="bg-green-500 text-white py-1 px-3 rounded mr-2"
                >
                  👍 {review.upvotes}
                </button>
                <button
                  onClick={() => handleVote(review.id, "downvote")}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  👎 {review.downvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default MovieReviews;
