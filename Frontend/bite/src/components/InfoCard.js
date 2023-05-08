import React from 'react';
import './InfoCard.css';
import { MdStar, MdAttachMoney } from 'react-icons/md';
import ReviewForm from './ReviewForm';

const InfoCard = ({ selectedRestaurant, restaurantReviews, handleReviewFormToggle, onReviewSubmit, showReviewForm, showInfoWindow, setShowInfoWindow }) => {
  const userId = localStorage.getItem("userId");

  return (
    <div className="info-card">
      <div className="restaurant-info">
        <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 25, lineHeight: '44px', color: '#000000', 'padding-left': '2px' }}>
          {selectedRestaurant.label || selectedRestaurant.name}
        </h3>
        <p className = "wrapword2">
          Location: {selectedRestaurant.location || "No location data available"}
        </p>
        <p className = "wrapword2">
          Average Rating: {selectedRestaurant.average_user_rating || "No user rating data"}
        </p>
        <p className = "wrapword2">
          Average Price Rating: {selectedRestaurant.average_price_rating ? (
              [...Array(parseInt(selectedRestaurant.average_price_rating))].map((_, index) => (
                <MdAttachMoney key={index} className="money-icon" />
              ))
            ) : (
              'Price Rating Not Available'
            )}
        </p>
      </div>
      <button onClick={handleReviewFormToggle} className="add-review">
        {showReviewForm ? "Close Review" : "Create Review"}
      </button>
      {showReviewForm && (
        <ReviewForm
          restaurantId={selectedRestaurant._id}
          userId={userId}
          userName={localStorage.getItem("username")}
          handleClose={handleReviewFormToggle}
          onReviewSubmit={onReviewSubmit}
        />
      )}
      <div className='reviews'>
        <h4>Reviews:</h4>
        {restaurantReviews ? (
          restaurantReviews.map((review) => (
            <div key={review._id} className="review-content">
              <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, lineHeight: '24px', color: '#000000', 'margin': '0'}}>{review.username}</p>
              <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, lineHeight: '15px', color: '#F3684A', 'margin-top': '5px'}}>Star Rating: {review.star_rating}{" "} | Price Rating: {review.price_level}</p>
              <p className="wrapword"> {review.review_content}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
      <button className="info-card-close-btn" onClick={() => { setShowInfoWindow(false) }}>X</button>
    </div>
  );
};

export default InfoCard;
