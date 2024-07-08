import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {getOneSpot} from '../../store/spot';
import Reviews from '../Reviews/Reviews';

const SpotDetails = () => {
    const dispatch = useDispatch();
    let {spotId} = useParams();
    let spot = useSelector((state) => state.spots.byId[spotId]);
 

    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const getData = async() => {
            await dispatch(getOneSpot(spotId));
            setIsLoaded(true);
        };
        if(!spot){
            getData();
        }
        else{
            setIsLoaded(true);
        }
      }, [dispatch, spot, isLoaded]);

      if(!isLoaded){
        return <h1>Loading...</h1>
      }
      
    
    return (<>
        <h2>{spot.name}</h2>
        <h3><em>{spot.city} {spot.state}, {spot.country}</em></h3>
        {/* <p>{spot.Owner.firstName}</p> */}
        <div className = "calloutBox">
        <p>{spot.price} per night</p>
        <Reviews spot = {spot}/>
        <button onClick= {() => alert("Feature coming soon!")}>Reserve</button>
        </div>
    </>)
}

export default SpotDetails;
