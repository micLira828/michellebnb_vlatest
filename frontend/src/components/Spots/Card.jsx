import {Link} from 'react-router-dom';
import Tippy from '@tippyjs/react';
import image from './cozy_airbnb.jpg'
import 'tippy.js/dist/tippy.css'; // optional
import { useModal } from '../../context/Modal';
import { FaStar } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';


const Card = ({spot}) => {// optional: callback function that will be called once the modal is closed}) => {
  const {closeModal} = useModal();
  return (
      <Link className = "spotCard" to ={`spots/${spot.id}`}>
        <Tippy content = {spot.name}>
        <div className = 'card'>
          <div className = "card-img">
            <img src = {image}/>
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