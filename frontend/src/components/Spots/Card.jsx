import { NavLink} from 'react-router-dom';
import './Card.css'
const Card = ({spot}) => {
    
    return (
        <div className = 'card'>
          <h3>{spot.name}</h3>
          <p><em>{spot.city}, {spot.state}</em> <br></br>
          <strong>${spot.price} night </strong><br></br>
          {spot.avgRating ? spot.avgRating: "New"}</p>
          <NavLink to ={`spots/${spot.id}`}>View Spot Details</NavLink>
        </div>
    );
}









































































































export default Card;