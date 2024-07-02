import './Card.css'
const Card = ({spot}) => {
    console.log('The spot is', spot);
    return (
        <div className = 'card'>
          <h3>{spot.name}</h3>
          <p><em>{spot.city}, {spot.state}</em> <br></br>
          <strong>${spot.price} night </strong><br></br>
          {spot.avgRating ? spot.avgRating: "New"}</p>
        </div>
    );
}

export default Card;