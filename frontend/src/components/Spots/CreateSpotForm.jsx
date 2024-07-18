import {useState} from 'react';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postSpot} from '../../store/spot';
import { postSpotImage} from '../../store/spotImage';

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
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const SpotImages = [image1, image2, image3, image4, image5]
      

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
        
        const newSpot = await dispatch(postSpot(form));
        for(let pic of SpotImages){
            const SpotImage = {"url": pic, "preview": true}
            dispatch(postSpotImage(SpotImage, newSpot.id));
        }

        navigate(`spots/${newSpot.id}`);
    }

  
    return (
        <>
         <h2>Create a new spot</h2>
        <form onSubmit={handleSubmit}>
            <h3>Where&apos;s your place located?</h3>
            <p>
                Guests will only get your exact address once they have booked a
                reservation
            </p>
                <input value = {address}  onChange={(e) => setAddress(e.target.value)} placeholder = "address" type ="text"></input>
                <input value = {country}  onChange={(e) => setCountry (e.target.value)}placeholder = "country" type ="text"></input>
                <input  value = {city}  onChange={(e) => setCity(e.target.value)} placeholder = "city" type ="text"></input>
                <input  value = {state}  onChange={(e) => setState(e.target.value)} placeholder = "state" type ="text" ></input>
                <input  onChange={(e) => setLat(e.target.value)} value = {lat}  placeholder = "latitude" type = "decimal"/>
                <input  onChange={(e) => setLng(e.target.value)} value = {lng}  placeholder = "longitude" type = "decimal"/>

                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space,
                    any special amenities like fast wifi or parking,
                    and what you love about the neighborhood
                </p>
                <textarea placeholder = "Please write at least 30 characters" className = "description" onChange={(e) => setDescription(e.target.value)} value = {description}  rows = "10" cols = "20"></textarea>


                <h3>Create a title for your spot</h3>
                <p>Catch guests&apos; attention with a spot 
                    title that highlights what makes
                    this place special</p>
                <input placeholder = "Name of your spot" onChange={(e) => setName(e.target.value)} value = {name}  type = "text"></input>

                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help
                your listing stand out and rank higher 
                in search results
                </p>
                <input  placeholder = "Price per night(USD)" onChange={(e) => setPrice(e.target.value)} value = {price}  type = "decimal"/>
                
                <h3>Add your spot images</h3>
                <>
                <input placeholder = "Preview Image URL" value = {image1} onChange = {(e) => {setImage1(e.target.value)}} type = "url"/>
                <input placeholder = "Image URL" value = {image2} onChange = {(e) => {setImage2(e.target.value)}} type = "url"/>
                <input placeholder = "Image URL" value = {image3} onChange = {(e) => {setImage3(e.target.value)}} type = "url"/>
                <input placeholder = "Image URL" value = {image4} onChange = {(e) => {setImage4(e.target.value)}} type = "url"/>
                <input placeholder = "Image URL" value = {image5} onChange = {(e) => {setImage5(e.target.value)}} type = "url"/>
                </>
                  
            <button className = "redRectangular" type = 'submit'>Create a spot</button>
        </form>
        </>
    )
}

export default CreateSpotForm;