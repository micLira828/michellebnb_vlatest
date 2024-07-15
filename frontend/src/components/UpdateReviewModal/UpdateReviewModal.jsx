import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { updateReview} from '../../store/review';
import {useModal} from '../../context/Modal';
import { FaStar } from "react-icons/fa";
import './UpdateReviewModal.css';

const UpdateReviewModal = ({reviewId}) => {

    let rev = useSelector((state) => state.reviews.byId[reviewId]);

    const [stars, setStars] = useState(rev.stars);
    const [reviewText, setReviewText] = useState(rev.review);

    const {closeModal} = useModal();

    const dispatch = useDispatch();
   
    const handleSubmit = (e) => {
        e.preventDefault();
       
        const review = {
           "id": reviewId,
           stars,
           "review":reviewText
        }
        console.log(review);
        return dispatch(updateReview(review))
        .then(closeModal());
    }

  
    return (
        <div className = "reviewsModalContainer">
         <h2>How was your stay?</h2>
        <form onSubmit={handleSubmit}>
            <textarea value = {reviewText}  onChange={(e) => setReviewText (e.target.value)} placeholder = "Review" type ="text" />
            <div className = "starsBar">
            {[1, 2, 3, 4, 5].map((star, idx) => {
                return (   
                    <FaStar key = {idx}
                    style = {{
                        cursor: 'pointer',
                        stroke: 'black',
                        fill: stars >= star ? 'black' : 'gray',
                        fontSize: `35px`,
                    }}
                    onClick={() => {
                        setStars(star)
                    }}
                    />
         
                )
            })}
            </div>
        
                {/* <input value = {stars}  onChange={(e) => setStars(e.target.value)} placeholder = "Stars" type ="number"></input> */}
           <button type = 'submit'>Create a Review</button>
        </form>
        </div>
    )
}

export default UpdateReviewModal;