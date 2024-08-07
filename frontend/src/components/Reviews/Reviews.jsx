import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewCard from './ReviewCard';
import { getSpotReviews } from '../../store/review';

import OpenModalButton from '../OpenModalButton';
// import { useModal } from '../../context/Modal';
import { FaStar } from "react-icons/fa";
import './Reviews.css';
import CreateReviewModal from './CreateReviewModal';
const Reviews = ({spot}) => {
  const dispatch = useDispatch();

  // const {closeModal} = useModal();

  // const [showModal, setShowModal] = useState(false);
  // const ulRef = useRef();

  let sessionUser = useSelector((state) => state.session.user);

  let spotReviews = useSelector((state) => state.reviews.allReviews);
   console.log('The average rating for the spot is', spot.avgStarRating);
   console.log('The number of reviews for the spot is', spot.numReviews);
  
  useEffect(() => {
   dispatch(getSpotReviews({spot}));
  }, [dispatch, spot])

  const usersReview = sessionUser ? spotReviews.find(review => {return review.userId === sessionUser.id}) : undefined;

  return (
    <>
      <div className = "reviews">
        <div className = "ratingsSummary">
          <div className = "avgStarRating"><FaStar />{spot.avgStarRating > 0.0 ? spot.avgStarRating.toFixed(1): 'New'} </div>
          {spot.numReviews > 0 ? 
          (<>
           <div> .</div>
           <div className = "numberOfReviews">{spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</div>
           </>) : ""
          }
         
        </div>
       {sessionUser && spot.ownerId !== sessionUser.id 
       && !usersReview ? ( <><OpenModalButton className = "modalRedRectangular"
        modalComponent = {<CreateReviewModal spot = {spot}/>}
        buttonText = {'Post a Review'}
       /></>) 
       : ""}
        {spotReviews.map((review) => <ReviewCard review = {review} key = {review.id}/>)}
        {spotReviews.length < 1 ? <p>Be the first to post a review!</p> : ""}
      </div>
    {/* if user id matches current users if and if there is a user */}
   
    </>
  )
}

export default Reviews;
