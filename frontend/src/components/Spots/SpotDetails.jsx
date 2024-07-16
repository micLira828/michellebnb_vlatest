import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot";
import { FaStar } from "react-icons/fa";
import cottage from './cottage.jpg'
import cozyAirbnb from './cozy_airbnb.jpg'
import bedroom from './bedroom.jpg'
import Reviews from "../Reviews/Reviews";



const SpotDetails = () => {
  const dispatch = useDispatch();
  let { spotId } = useParams();
  console.log('The spot id now is', spotId)
  let spot = useSelector((state) => state.spots.byId[spotId]);
  console.log('The details for the spot are', spot);


let spotImages = spot ? spot.SpotImages : undefined;

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const getData = async () => {
      await dispatch(getOneSpot(spotId));
      setIsLoaded(true);
    };

    if (!spot || !spotImages) {
      getData();
    } else {
      setIsLoaded(true);
    }
  }, [dispatch, spot, isLoaded]);

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  
  console.log('The spot images is', spotImages)
  // console.log('The id of the first spot images is', spotImages[0].id)
 
  
  const previewImages = spotImages.length >= 4 ? spotImages.filter((image) => {return image.preview === true}) : undefined;
  const chosenPreviewImage = spotImages.length >= 4 ? previewImages[0] : undefined;
  const fourAlternateImages =  spotImages.length >= 4 ? previewImages.filter((image) => {return image.id !== chosenPreviewImage.id}) : undefined;
  // console.log('The four alternate images are', fourAlternateImages);

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
                {chosenPreviewImage ?
                <img alt = "image" src = {chosenPreviewImage.url}/>:<img src = {cozyAirbnb}/>}
            </div>
            <div className = "fourAlternateImages">
                {fourAlternateImages ? fourAlternateImages.map(image => 
                     <div key = {image.id} className = "sideImage">
                     <img alt = "image" src = {image.url}/>
                     </div>
                ):
                (<>
                <div className = "sideImage">
                <img alt = "image" src = {cottage}/>
                </div>
                <div className = "sideImage">
                <img alt = "image" src = {bedroom}/>
                </div>
                <div className = "sideImage">
                <img alt = "image" src = {cottage}/>
                </div>
                <div className = "sideImage">
                <img alt = "image" src = {bedroom}/>
                </div>
                </>)
                }
            </div>
        </div>
        <main>
          <div className="mainInfo">
            <h3>
              Hosted by:{spot.Owner.firstName} {spot.Owner.lastName}
            </h3>
            <p>{spot.description}</p>
            <Reviews spot = {spot} /> 
          </div>
          <div className="calloutBox">
            <div className = "topRow">
            <div><FaStar />{spot.avgStarRating.toFixed(1)}</div>
            <div>.</div>
            <div> {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</div>
             </div>
             <h4>${spot.price} night</h4>
            <button className = "redRectangular" onClick={() => alert("Feature coming soon!")}>
              Reserve
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default SpotDetails;