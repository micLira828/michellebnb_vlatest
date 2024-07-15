import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {removeReview} from '../../store/review';
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css'

const DeleteReviewModal = ({reviewId}) =>{
    let review = useSelector((state) => state.reviews.byId[reviewId]);
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const deleteTheReview = (e) => {
        e.preventDefault();
        alert('Cold Syrup!');
        dispatch(removeReview(review)).then(closeModal)
    }
    
    return (<div className = "deleteModalContainer">
        <p>Are you sure you want to delete this review?</p>
        <button className = "redRectangular deleteButton" onClick = {deleteTheReview}>Yes(Delete Review)</button>
        <button className = "deleteButton" onClick = {closeModal}>No(Keep Review)</button>
    </div>)
    
}

export default DeleteReviewModal