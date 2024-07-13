import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewCard from './ReviewCard';
import { getSpotReviews } from '../../store/review';
import CreateReview from './CreateReview';
import './Reviews.css';
const Reviews = (spot) => {
  const dispatch = useDispatch();

  let spotReviews = useSelector((state) => state.reviews.allReviews);
  
  useEffect(() => {
   dispatch(getSpotReviews(spot));
  }, [dispatch, spot])
  return (
    <>
    {
      <div className = "reviews">
        {spotReviews.map((review) => <ReviewCard review = {review} key = {review.id}/>)}
      </div>
    }
   <button>Post a Review</button>
   <CreateReview spot = {spot}/>
    </>
  )
}

export default Reviews;
