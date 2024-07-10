import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom';
import {removeSpot} from '../../store/spot';
const DeleteSpot = () =>  {
    let {spotId} = useParams();
    let spot = useSelector((state) => state.spots.byId[spotId]);
    const dispatch = useDispatch();
    dispatch(removeSpot(spot));
}

export default DeleteSpot;