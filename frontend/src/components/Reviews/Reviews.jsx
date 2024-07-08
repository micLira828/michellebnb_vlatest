import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewCard from './ReviewCard';
import { NavLink} from 'react-router-dom';
import { getSpotReviews } from '../../store/review';
import CreateReview from './CreateReview';
const Reviews = (spot) => {
  const dispatch = useDispatch();

  let spotReviews = useSelector((state) => state.reviews.allReviews);
  
  useEffect(() => {
   dispatch(getSpotReviews(spot));
  }, [dispatch, spot])
  return (
    <>
    {
      <ul>
        {spotReviews.map((review) => <ReviewCard review = {review} key = {review.id}/>)}
      </ul>
    }
   <button>Post a Review</button>
   <CreateReview spot = {spot}/>
    </>
  )
}

export default Reviews;
