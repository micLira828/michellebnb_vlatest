// import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom';
import {removeReview} from '../../store/review';
const DeleteReview = () =>{
    let {reviewId} = useParams();
    let review = useSelector((state) => state.reviews.byId[reviewId]);
    const dispatch = useDispatch();
    dispatch(removeReview(review));
    return<>
    <h2>Review Deleted</h2>
    </>
}

export default DeleteReview;