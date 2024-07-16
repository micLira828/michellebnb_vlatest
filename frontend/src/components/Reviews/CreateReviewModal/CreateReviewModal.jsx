import {useState} from 'react';
import {useDispatch} from 'react-redux'
import { useModal } from '../../../context/Modal';
import reviewsReducer, { postReview} from '../../../store/review';
import { FaRegStar, FaStar } from "react-icons/fa";
import './CreateReviewModal.css';

const CreateReviewModal = ({spot}) => {
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const {closeModal} = useModal();
    
    const dispatch = useDispatch();
   
  
    const handleSubmit = (e) => {
        e.preventDefault();
       
        const form = {
           stars,
           review
        }
        console.log(form);
      
        dispatch(postReview(spot, form)).then(closeModal);
    }

  
    return (
        <div className = "reviewsModalContainer">
         <h2>How was your stay?</h2>
        <form onSubmit={handleSubmit}>
            <textarea value = {review}  onChange={(e) => setReview (e.target.value)} placeholder = "Review" type ="text" />
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

export default CreateReviewModal;