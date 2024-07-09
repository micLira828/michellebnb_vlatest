import { NavLink, Link} from 'react-router-dom';
import Tippy from '@tippyjs/react';
import image from './cozy_airbnb.jpg'
import 'tippy.js/dist/tippy.css'; // optional
import './Card.css'
const Card = ({spot}) => {
    
    return (
      <Link class = "spotCard" target = '_blank' to ={`spots/${spot.id}`}>
        <Tippy content = {spot.name}>
        <div className = 'card'>
          <div className = "card-img">
            <img src = {image}/>
          </div>
         <div class = 'card-body'>
            <p><em>{spot.city}, {spot.state}</em> <br></br>
            <strong>${spot.price} night </strong><br></br>
            {spot.avgRating ? spot.avgRating: "New"}</p>
            <div class = 'buttonGroup'>
             <NavLink to ={`spots/${spot.id}/edit`}>Edit Spot Details</NavLink>
             <NavLink to ={`spots/${spot.id}/delete`}>Delete</NavLink>
        </div>
         </div>
        
        </div>
        </Tippy>
        </Link>
    );
}









































































































export default Card;