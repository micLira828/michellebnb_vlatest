import {Link} from 'react-router-dom';
import Tippy from '@tippyjs/react';
import image from './cozy_airbnb.jpg'
import 'tippy.js/dist/tippy.css'; // optional
import { useModal } from '../../context/Modal'
import { FaStar } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

//imports from spotDetails
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import cottage from './cottage.jpg'
import cozyAirbnb from './cozy_airbnb.jpg'
import bedroom from './bedroom.jpg'
import Reviews from "../Reviews/Reviews";


const Card = ({spot}) => {// optional: callback function that will be called once the modal is closed}) => {
  const chosenPreviewImage = spot.previewImage;
  const {closeModal} = useModal();
  return (
      <Link className = "spotCard" to ={`spots/${spot.id}`}>
        <Tippy content = {spot.name}>
        <div className = 'card'>
          <div className = "card-img">
           {chosenPreviewImage ? <img src = {chosenPreviewImage}/> : <img src = {image}/>}
          </div>
         <div className = 'cardBody'>
          <div className="mainCardInfo">
            <h4>{spot.city}, {spot.state}</h4> 
            <h5>${spot.price} night </h5>
          </div>
          <div className = "ratings">
            <span>
           <FaStar />
            {spot.avgRating ? spot.avgRating.toFixed(1): "New"}
            </span>
          </div>
         </div>
        
        </div>
        </Tippy>
        </Link>
    );
}









































































































export default Card;