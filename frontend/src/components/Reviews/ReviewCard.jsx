import { NavLink } from "react-router-dom"
import OpenModalButton from "../OpenModalButton";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import moment from 'moment'
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import UpdateReviewModal from "../UpdateReviewModal";
const ReviewCard = ({review, spot}) => {

    const {closeModal} = useModal();
    const sessionUser = useSelector((state) => state.session.user);

    const verbalDate = moment(review.createdAt).format("MMMM YYYY"); // "Sunday, February 14th 2010, 3:25:50 pm"
    
    
    return (<div className = "review">
    <h4>{review?.User?.firstName}</h4>
    <h4>{verbalDate}</h4>
     <p>{review.review}</p>
     {sessionUser && sessionUser.id === review.userId ? (<>
        <OpenModalButton 
                 modalComponent = {<UpdateReviewModal reviewId = {review.id}/>}
                 buttonText = {'Update Review'}
                 onModalClose={closeModal}/>
     <OpenModalButton 
                 modalComponent = {<DeleteReviewModal reviewId = {review.id}/>}
                 buttonText = {'Delete Review'}
                 onModalClose={closeModal}/>
    </>) : ""}
    </div>)
   
}

export default ReviewCard;