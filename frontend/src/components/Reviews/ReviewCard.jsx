import { NavLink } from "react-router-dom"
const ReviewCard = ({review}) => {

    return (<>
     <p>{review.review}</p>
     <NavLink to = {`/reviews/${review.id}/edit`}><button>Edit a Review</button></NavLink>
     <NavLink to = {`/reviews/${review.id}/delete`}><button>Delete a Review</button></NavLink>
    </>)
   
}

export default ReviewCard;