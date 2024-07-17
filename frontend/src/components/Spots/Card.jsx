import {Link} from 'react-router-dom';
import Tippy from '@tippyjs/react';
import image from './cozy_airbnb.jpg'
import 'tippy.js/dist/tippy.css'; // optional
import { FaStar } from "react-icons/fa";


//imports from spotDetails

const Card = ({spot}) => {// optional: callback function that will be called once the modal is closed}) => {
  const chosenPreviewImage = spot.previewImage;
  
  return (
      <Link className = "spotCard" to ={`/spots/${spot.id}`}>
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