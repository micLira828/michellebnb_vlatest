import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spot';
import Card from './Card'
import './Spots.css'

const Spots = () => {
    const dispatch = useDispatch();
     
    const spots = useSelector((state) => state.spots.allSpots);

    
    useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);

    return (
        <div className = "spots">
             {spots?.map((spot) => (
                <div key = {spot.name}>
                 <Card  spot={spot}/>
                 </div>
            ))}
        </div>
    );
}

export default Spots;