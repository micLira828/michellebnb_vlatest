import {useState} from 'react';
import {useDispatch} from 'react-redux'
import { postReview} from '../../../store/review';
import './CreateReviewModal.css';

const CreateReviewModal = ({spot}) => {
    const [stars, setStars] = useState(0.0);
    const [review, setReview] = useState('');
    
    const dispatch = useDispatch();
   
  
    const handleSubmit = (e) => {
        e.preventDefault();
       
        const form = {
           stars,
           review
        }
        console.log(form);
        dispatch(postReview(spot, form));
    }

  
    return (
        <>
         <h2>Create a new Review</h2>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend><strong>Review</strong></legend>
                <input value = {stars}  onChange={(e) => setStars(e.target.value)} placeholder = "Stars" type ="number"></input>
                <textarea value = {review}  onChange={(e) => setReview (e.target.value)} placeholder = "Review" type ="text" />
            </fieldset>
           <button type = 'submit'>Create a Review</button>
        </form>
        </>
    )
}

export default CreateReviewModal;