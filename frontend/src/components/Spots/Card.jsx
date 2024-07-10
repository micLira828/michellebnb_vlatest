import { NavLink, Link} from 'react-router-dom';
import Tippy from '@tippyjs/react';
import image from './cozy_airbnb.jpg'
import 'tippy.js/dist/tippy.css'; // optional
import { FaStar } from "react-icons/fa";
const Card = ({spot}) => {
    
    return (
      <Link class = "spotCard" target = '_blank' to ={`spots/${spot.id}`}>
        <Tippy content = {spot.name}>
        <div className = 'card'>
          <div className = "card-img">
            <img src = {image}/>
          </div>
         <div class = 'cardBody'>
          <div className="mainCardInfo">
            <h4>{spot.city}, {spot.state}</h4> 
            <h5>${spot.price} night </h5>
          </div>
          <div class = "ratings">
            <span>
           <FaStar />
            {spot.avgRating ? spot.avgRating: "New"}
            </span>
          </div>
            {/* <div class = 'buttonGroup'>
             <NavLink to ={`spots/${spot.id}/edit`}>Edit Spot Details</NavLink>
             <NavLink to ={`spots/${spot.id}/delete`}>Delete</NavLink>
        </div> */}
         </div>
        
        </div>
        </Tippy>
        </Link>
    );
}









































































































export default Card;