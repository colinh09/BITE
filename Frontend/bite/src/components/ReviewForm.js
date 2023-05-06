import React, { useState } from 'react';

const ReviewForm = ({ userId, restaurantId, onReviewSubmit }) => {
  const [reviewContent, setReviewContent] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [priceLevel, setPriceLevel] = useState(1);
  const [repeatVisit, setRepeatVisit] = useState(false);
  const [publicReview, setPublicReview] = useState(true);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmit({ userId, restaurantId, reviewContent, starRating, priceLevel, repeatVisit, publicReview });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Write your review"
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
      />
      
      <label htmlFor="star-rating">Star Rating: {starRating}</label>
      <input
        type="range"
        id="star-rating"
        min="1"
        max="5"
        step="0.1"
        value={starRating}
        onChange={(e) => setStarRating(parseFloat(e.target.value))}
      />
      
      <label htmlFor="price-level">Price Level: {priceLevel}</label>
      <input
        type="range"
        id="price-level"
        min="1"
        max="5"
        step="0.1"
        value={priceLevel}
        onChange={(e) => setPriceLevel(parseFloat(e.target.value))}
      />
      
      <label htmlFor="repeat-visit">Repeat Visit</label>
      <input
        type="checkbox"
        id="repeat-visit"
        checked={repeatVisit}
        onChange={(e) => setRepeatVisit(e.target.checked)}
      />
      
      <label htmlFor="public-review">Public Review</label>
      <input
        type="checkbox"
        id="public-review"
        checked={publicReview}
        onChange={(e) => setPublicReview(e.target.checked)}
      />
      
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;