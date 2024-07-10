import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot";
import cottage from './cottage.jpg'
import cozyAirbnb from './cozy_airbnb.jpg'
import bedroom from './bedroom.jpg'
import Reviews from "../Reviews/Reviews";

const SpotDetails = () => {
  const dispatch = useDispatch();
  let { spotId } = useParams();
  let spot = useSelector((state) => state.spots.byId[spotId]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const getData = async () => {
      await dispatch(getOneSpot(spotId));
      setIsLoaded(true);
    };
    if (!spot) {
      getData();
    } else {
      setIsLoaded(true);
    }
  }, [dispatch, spot, isLoaded]);

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className="spotContainer">
        <div className="titleContainer">
          <h3>{spot.name}</h3>
          <h4>
            {spot.city} {spot.state}, {spot.country}
          </h4>
        </div>
        <div className = "imageBox">
            <div className = "previewImage">
                <img src = {cozyAirbnb}/>
            </div>
            <div className = "fourAlternateImages">
                <div className = "sideImage">
                <img src = {cottage}/>
                </div>
                <div className = "sideImage">
                    <img src = {bedroom}/>
                </div>
                <div className = "sideImage">
                    <img src = {bedroom}/>
                </div>
                <div className = "sideImage">
                    <img src = {cottage}/>
                </div>
            </div>
        </div>
        <main>
          <div className="mainInfo">
            <h3>
              Hosted by:{spot.Owner.firstName} {spot.Owner.lastName}
            </h3>
            <p>{spot.description}</p>
            {/* <Reviews spot = {spot}/>  */}
          </div>
          <div className="calloutBox">
            <h4>{spot.price} night</h4>
            <button onClick={() => alert("Feature coming soon!")}>
              Reserve
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default SpotDetails;
