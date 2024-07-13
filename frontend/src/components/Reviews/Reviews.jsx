import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewCard from './ReviewCard';
import { getSpotReviews } from '../../store/review';
import CreateReview from './CreateReview';
import { FaStar } from "react-icons/fa";
import './Reviews.css';
const Reviews = ({spot}) => {
  const dispatch = useDispatch();

  let sessionUser = useSelector((state) => state.session.user);

  let spotReviews = useSelector((state) => state.reviews.allReviews);
   console.log('The average rating for the spot is', spot.avgStarRating);
   console.log('The number of reviews for the spot is', spot.numReviews);
  
  useEffect(() => {
   dispatch(getSpotReviews({spot}));
  }, [dispatch, spot])

  const usersReview = spotReviews.find(review => {return review.userId === sessionUser.id})

  console.log('The current users id is', sessionUser.id)
  console.log('The usersReview is', usersReview)
  return (
    <>
      <div className = "reviews">
        <div className = "ratingsSummary">
         <h3><FaStar />{`${spot.avgStarRating}  .  ${spot.numReviews} reviews`}</h3>
        </div>
       {sessionUser && !usersReview ? (<button className = "redRectangular">Post a Review</button>) : ""}
        {spotReviews.map((review) => <ReviewCard review = {review} key = {review.id}/>)}
      </div>
    {/* if user id matches current users if and if there is a user */}
   
   <CreateReview spot = {spot}/>
    </>
  )
}

export default Reviews;
