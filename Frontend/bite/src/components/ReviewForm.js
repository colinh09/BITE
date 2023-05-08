import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ userId, restaurantId, onReviewSubmit }) => {
  const [reviewContent, setReviewContent] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [priceLevel, setPriceLevel] = useState(1);
  const [repeatVisit, setRepeatVisit] = useState(false);
  const [publicReview, setPublicReview] = useState(true);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmit(
      userId,
      restaurantId,
      reviewContent,
      starRating,
      priceLevel,
      repeatVisit,
      publicReview
    );
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3 className="review-title">Your Review</h3>
      <textarea
        className="review-textarea"
        placeholder="Write your review"
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
      />
        
      <div className="rating-section">
        <label htmlFor="star-rating" className="rating-label">Star Rating: {starRating}</label>
        <input
          type="range"
          id="star-rating"
          min="1"
          max="5"
          step="0.1"
          value={starRating}
          onChange={(e) => setStarRating(parseFloat(e.target.value))}
        />
      </div>
        
      <div className="price-section">
        <label htmlFor="price-level" className="price-label">Price Level: {priceLevel}</label>
        <input
          type="range"
          id="price-level"
          min="1"
          max="5"
          step="0.1"
          value={priceLevel}
          onChange={(e) => setPriceLevel(parseFloat(e.target.value))}
        />
      </div>
        
      <div className="checkbox-section">
        <label htmlFor="repeat-visit" className="checkbox-label">Repeat Visit</label>
        <input
          type="checkbox"
          id="repeat-visit"
          checked={repeatVisit}
          onChange={(e) => setRepeatVisit(e.target.checked)}
        />
      </div>
      <button type="submit" className="submit-button">Submit Review</button>
    </form>
  );  
};

export default ReviewForm;