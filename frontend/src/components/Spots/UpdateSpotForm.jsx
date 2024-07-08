import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom';
import { updateSpot} from '../../store/spot';
const UpdateSpotForm = () => {

    let {spotId} = useParams();
    let spot = useSelector((state) => state.spots.byId[spotId]);
    const dispatch = useDispatch();
   
    console.log('spot:', spot);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [country, setCountry] = useState(spot.country);
    const [state, setState] = useState(spot.state)
    const [name, setName] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [description, setDescription] = useState(spot.description);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);

  
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = {
            id: spot.id,
            name,
            address,
            city,
            country,
            state,
            lat, 
            lng,
            description,
            price
        }
        console.log(form);
        const spotId = form.id;
        dispatch(updateSpot(form));
    }

  
    return (
        <>
         <h2>Create a new spot</h2>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend><strong>Where is your form located?</strong></legend>
                <input value = {address}  onChange={(e) => setAddress(e.target.value)} placeholder = {`${address}`} type ="text"></input>
                <input value = {country}  onChange={(e) => setCountry (e.target.value)}placeholder = {`${country}`}  type ="text"></input>
                <input  value = {city}  onChange={(e) => setCity(e.target.value)} placeholder = {`${city}`}  type ="text"></input>
                <input  value = {state}  onChange={(e) => setState(e.target.value)} placeholder = {`${state}`}  type ="text" ></input>
                <input  onChange={(e) => setLat(e.target.value)} value = {lat}  placeholder = {`${lat}`}  type = "decimal"/>
                <input  onChange={(e) => setLng(e.target.value)} value = {lng}  placeholder = {`${lng}`}  type = "decimal"/>
            </fieldset>
            <fieldset>
                <legend><strong>Describe your place to guests</strong></legend>
                <textarea  onChange={(e) => setDescription(e.target.value)} value = {description}  rows = "10" cols = "20"></textarea>
            </fieldset>
            <fieldset>
                <legend><strong>Create a title for your spot</strong></legend>
                <input   onChange={(e) => setName(e.target.value)} value = {name}  type = "text"></input>
            </fieldset>
            <fieldset>
                <legend><strong>Set a base price for your spot</strong></legend>
                <input  onChange={(e) => setPrice(e.target.value)} value = {price}  type = "decimal"/>
            </fieldset>
            <button type = 'submit'>Update the spot</button>
        </form>
        </>
    )
}

export default UpdateSpotForm;