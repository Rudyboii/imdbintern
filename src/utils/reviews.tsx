import React from "react";

interface Review {
  id: number;
  text: string;
  isEditing: boolean;
}

export const handleReviewEdit = (
  reviewId: number,
  reviews: Review[],
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
  setReviewText: React.Dispatch<React.SetStateAction<string>>
) => {
  const reviewToEdit = reviews.find((review) => review.id === reviewId);
  if (reviewToEdit) {
    setReviewText(reviewToEdit.text);
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, isEditing: true } : review
      )
    );
  }
};

export const handleReviewSave = (
  reviewId: number,
  newText: string,
  reviews: Review[],
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
  setReviewText: React.Dispatch<React.SetStateAction<string>>
) => {
  setReviews((prevReviews) =>
    prevReviews.map((review) =>
      review.id === reviewId
        ? { ...review, text: newText, isEditing: false }
        : review
    )
  );
  setReviewText(""); // Clear the review text after saving
};

export const handleReviewDelete = (
  reviewId: number,
  reviews: Review[],
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
) => {
  setReviews((prevReviews) =>
    prevReviews.filter((review) => review.id !== reviewId)
  );
};
