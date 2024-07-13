import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewCard from './ReviewCard';
import { getSpotReviews } from '../../store/review';
import CreateReview from './CreateReview';
import { FaStar } from "react-icons/fa";
import './Reviews.css';
const Reviews = ({spot}) => {
  const dispatch = useDispatch();

  let spotReviews = useSelector((state) => state.reviews.allReviews);
   console.log('The average rating for the spot is', spot.avgStarRating);
   console.log('The number of reviews for the spot is', spot.numReviews);
  
  useEffect(() => {
   dispatch(getSpotReviews({spot}));
  }, [dispatch, spot])
  return (
    <>
    {
      <div className = "reviews">
        <ul className = "ratingsSummary">
         <h3><FaStar />{`${spot.avgStarRating}  .  ${spot.numReviews} reviews`}</h3>
        </ul>
        {spotReviews.map((review) => <ReviewCard review = {review} key = {review.id}/>)}
      </div>
    }
   <button>Post a Review</button>
   <CreateReview spot = {spot}/>
    </>
  )
}

export default Reviews;
