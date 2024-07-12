import {Link} from 'react-router-dom';
import Tippy from '@tippyjs/react';
import image from './cozy_airbnb.jpg'
import 'tippy.js/dist/tippy.css'; // optional
import { useModal } from '../../context/Modal';
import { FaStar } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

//imports from spotDetails
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllSpotImages } from "../../store/spotImage";
import cottage from './cottage.jpg'
import cozyAirbnb from './cozy_airbnb.jpg'
import bedroom from './bedroom.jpg'
import Reviews from "../Reviews/Reviews";


const Card = ({spot}) => {// optional: callback function that will be called once the modal is closed}) => {


  const dispatch = useDispatch();
     
    const spotImages = useSelector((state) => state.spotImages.allSpotImages);

    useEffect(() => {
        dispatch(getAllSpotImages(spot));
      }, [dispatch]);

  const previewImages = spotImages && spotImages.length >= 4 ? spotImages.filter((image) => {return image.preview === true}) : undefined;
  const chosenPreviewImage = spotImages && spotImages.length >= 4 ? previewImages[0] : undefined;

  return (
      <Link className = "spotCard" to ={`spots/${spot.id}`}>
        <Tippy content = {spot.name}>
        <div className = 'card'>
          <div className = "card-img">
           <img src = {chosenPreviewImage ? chosenPreviewImage : image}/>
          </div>
         <div className = 'cardBody'>
          <div className="mainCardInfo">
            <h4>{spot.city}, {spot.state}</h4> 
            <h5>${spot.price} night </h5>
          </div>
          <div className = "ratings">
            <span>
           <FaStar />
            {spot.avgRating ? spot.avgRating: "New"}
            </span>
          </div>
            {/* <div class = 'buttonGroup'>
             <NavLink to ={`spots/${spot.id}/edit`}>Edit Spot Details</NavLink>
            </div> */}
        
           {/* <NavLink to ={`spots/${spot.id}/delete`}>Delete</NavLink> */}
         </div>
        
        </div>
        </Tippy>
        </Link>
    );
}









































































































export default Card;