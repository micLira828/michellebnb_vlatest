import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {updateSpot} from "../../../store/spot";
import './UpdateSpotModal.css';
const UpdateSpotForm = () => {
  const {spotId} = useParams();
  const navigate = useNavigate();
  console.log('The spotId is', spotId);
  let spot = useSelector((state) => state.spots.byId[spotId]);
  console.log(`The spot of ${spotId} is`, spot)
  const dispatch = useDispatch();
  let sessionUser = useSelector((state) => state.session.user);
  
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [country, setCountry] = useState(spot.country);
  const [state, setState] = useState(spot.state);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);
  const [description, setDescription] = useState(spot.description);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);

  console.log("the longitude is", lng)
  const handleSubmit = async(e) => {
    e.preventDefault();
    const form = {
      "id": spot.id,
      "ownerId": sessionUser.id,
      "spotImages": spot.SpotImages,
      "name" : name,
      "address" : address,
      "city": city,
      "country": country,
      "state" : state,
      "lat" : lat,
      "lng" : lng,
      "description": description,
      "price" : price
    }
    console.log(form);
    
    const editedSpot =  await dispatch(updateSpot(form));
    console.log(editedSpot);
    navigate(`/spots/${editedSpot.id}`);
  }

  return (
    <>
      <h2>Update your spot</h2>
      <form onSubmit={handleSubmit}>
        <h3>Where&apos;s your place located?</h3>
        <p>
          Guests will only get your exact address once they have booked a
          reservation
        </p>
        <label htmlFor="country">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={`${country}`}
            type="text"
          ></input>
      
        <label htmlFor="address">Street Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={`${address}`}
            type="text"
          ></input>
        <div className="flexContainer">
          <div className = "labelContainer">
          <label htmlFor="city">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={`${city}`}
              type="text"
          ></input>
         </div>
          <label htmlFor="state">State
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder={`${state}`}
              type="text"
            ></input>
             </label>
            </div>
            <div>
            <div className="flexContainer">
            <div className="labelContainer">
            <label htmlFor = "lat">Latitude</label>
            <input
          onChange={(e) => setLat(e.target.value)}
          value={lat}
          placeholder={`${lat}`}
          type="decimal"
        />
         </div>
         <div className = "labelContainer">
        <label htmlFor="lng"> Longitude</label>
        <input
          onChange={(e) => setLng(e.target.value)}
          value={lng}
          placeholder={`${lng}`}
          type=
          "decimal"
        />
        </div>
        </div>
        </div>
       
         <h3>Describe your place to guests</h3>
         <p>Mention the best features of your space,
            any special amenities like fast wifi or parking,
            and what you love about the neighborhood
         </p>
         <label htmlFor="description">Description</label>
          <textarea className = "description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows="10"
            cols="20"
          ></textarea>
         

          <h3>Create a title for your spot</h3>
          <p>Catch guests&apos; attention with a spot 
            title that highlights what makes
            this place special</p>
            <label htmlFor="title">Title</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
          ></input>
     
            <h3>Set a base price for your spot</h3>
            <p>Competitive pricing can help
            your listing stand out and rank higher 
            in search results
            </p>
            <label htmlFor="price">Price</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="decimal"
          />

         
        <button className = "redRectangular" type="submit">Update the spot</button>
      </form>
    </>
  );
};

export default UpdateSpotForm;
