const Card = ({spot}) => {
    console.log('The spot is', spot);
    return (
        <>
          <h2>{spot.name}</h2>
          <p>{spot.city}</p>
          <p>{spot.state}</p>
          <p>${spot.price} night</p>
          <p>{spot.avgRating ? spot.avgRating: "New"}</p>
        </>
    );
}

export default Card;