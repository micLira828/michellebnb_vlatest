import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {removeSpot} from '../../store/spot';
import { useModal } from '../../context/Modal';
import './DeleteModal.css'

const DeleteSpotModal = ({spotId}) =>{
    let spot = useSelector((state) => state.spots.byId[spotId]);
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const deleteTheSpot = (e) => {
        e.preventDefault();
        alert('Cold Syrup!');
        dispatch(removeSpot(spot)).then(closeModal)
    }
    
    return (<div className = "deleteModalContainer">
        <p>Are you sure you want to
        remove the spot from the listings?</p>
        <button className = "redRectangular deleteButton" onClick = {deleteTheSpot}>Yes(Delete Spot)</button>
        <button className = "deleteButton" onClick = {closeModal}>No(Keep Spot)</button>
    </div>)
    
}

export default DeleteSpotModal