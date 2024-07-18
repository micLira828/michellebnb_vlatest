import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux'
import { useModal } from '../../../context/Modal';
import { postReview} from '../../../store/review';
import { FaStar } from "react-icons/fa";
import './CreateReviewModal.css';

const CreateReviewModal = ({spot}) => {
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const {closeModal} = useModal();
    const [buttonOut, setButtonOut] = useState(true);
    
    const dispatch = useDispatch();
   
    useEffect(() => {
        setButtonOut(true);
        if(review.length >= 10 && stars){
            setButtonOut(false);
        }
    }, [review, stars])
  
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
            <textarea placeholder = "Leave your review here..." value = {review}  onChange={(e) => setReview (e.target.value)} type ="text" />
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
           <button disabled = {buttonOut ? true: false} type = 'submit'>Submit Your Review</button>
        </form>
        </div>
    )
}

export default CreateReviewModal;