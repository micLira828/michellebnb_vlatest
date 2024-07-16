import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom';
import { updateReview} from '../../store/review';
import { Link } from 'react-router-dom';
const UpdateReview = () => {

    let {reviewId} = useParams();
    let spot = useSelector((state) => state.reviews.byId[reviewId]);
    const dispatch = useDispatch();
   
    const [rating, setRating] = useState(spot.review);
    const [stars, setStars] = useState(spot.stars);

    reviewId = parseInt(reviewId);
   

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = {
            "id": reviewId,
            "review": rating,
            stars
        }
        console.log(form);
        const reviewId = form.id;
        dispatch(updateReview(form));
    }

  
    return (
        <>
         <h2>Create a new spot</h2>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend><strong>What do you want to say?</strong></legend>
                <input  value = {rating}  onChange={(e) => setRating(e.target.value)} placeholder = {`${rating}`}  type ="text" ></input>
                <input  onChange={(e) => setStars(e.target.value)} value = {stars}  placeholder = {`${stars}`}  type = "decimal"/>
            </fieldset>
            <Link to = {`/reviews/${rating.id}/edit`} type = 'submit'>Update the Review</Link>
        </form>
        </>
    )
}

export default UpdateReview;