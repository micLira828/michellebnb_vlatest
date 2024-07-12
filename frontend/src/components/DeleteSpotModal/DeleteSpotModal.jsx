import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {removeSpot} from '../../store/spot';
import { useModal } from '../../context/Modal';

const DeleteSpotModal = ({spotId}) =>{
    let spot = useSelector((state) => state.spots.byId[spotId]);
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const deleteTheSpot = (e) => {
        e.preventDefault();
        alert('Cold Syrup!');
        dispatch(removeSpot(spot)).then(closeModal)
    }
    
    return (<>
        <p>Are you sure you want to
        remove the spot from the listings?</p>
        <button className = "redRectangular" onClick = {deleteTheSpot}>Yes(Delete Spot)</button>
        <button onClick = {closeModal}>No(Keep Spot)</button>
    </>)
    
}

export default DeleteSpotModal