import {useState} from 'react';
import {useDispatch} from 'react-redux'
import { postSpot} from '../../store/spot';
const CreateSpotForm = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('')
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState(0.0);
    const [lng, setLng] = useState(0.0);
    const dispatch = useDispatch();
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = {
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
        dispatch(postSpot(form));
    }

  
    return (
        <>
         <h2>Create a new spot</h2>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend><strong>Where is your form located?</strong></legend>
                <input value = {address}  onChange={(e) => setAddress(e.target.value)} placeholder = "address" type ="text"></input>
                <input value = {country}  onChange={(e) => setCountry (e.target.value)}placeholder = "country" type ="text"></input>
                <input  value = {city}  onChange={(e) => setCity(e.target.value)} placeholder = "city" type ="text"></input>
                <input  value = {state}  onChange={(e) => setState(e.target.value)} placeholder = "state" type ="text" ></input>
                <input  onChange={(e) => setLat(e.target.value)} value = {lat}  placeholder = "latitude" type = "decimal"/>
                <input  onChange={(e) => setLng(e.target.value)} value = {lng}  placeholder = "longitude" type = "decimal"/>
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
            <button type = 'submit'>Create a spot</button>
        </form>
        </>
    )
}

export default CreateSpotForm;