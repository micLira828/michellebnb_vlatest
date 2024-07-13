import { NavLink } from "react-router-dom"
import moment from 'moment'
const ReviewCard = ({review}) => {

    // const createdAtReviewArr = review.createdAt.split('');
    // const date = createdAtReviewArr[0];
    // const dateArr = date.split('-');
    // const year = dateArr[0];
    // const twoDigitMonth = dateArr[1].toString();
    // const monthDigit = twoDigitMonth[1];

    // const monthsArray = ['January', 'February', 'March', 'April',
    //      'May', 'June', 'July', 'August', 'September', 'October', 'November', '']

    const verbalDate = moment(review.createdAt).format("MMMM YYYY"); // "Sunday, February 14th 2010, 3:25:50 pm"
    
    
    return (<div className = "review">
    <h4>{review.User.firstName}</h4>
    <h4>{verbalDate}</h4>
     <p>{review.review}</p>
     <NavLink to = {`/reviews/${review.id}/edit`}><button>Edit a Review</button></NavLink>
     <NavLink to = {`/reviews/${review.id}/delete`}><button>Delete a Review</button></NavLink>
    </div>)
   
}

export default ReviewCard;