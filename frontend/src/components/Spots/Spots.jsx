import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spot';
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';
import Card from './Card'
import './Spots.css'

const Spots = () => {
    const dispatch = useDispatch();
     
    const spots = useSelector((state) => state.spots.allSpots);
    const {closeModal} = useModal();
    
    useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);

    return (
        <div className = "spots">
             {spots?.map((spot) => (
                <div key = {spot.name}>
                 <Card  spot={spot}/>
                 <OpenModalButton 
                 modalComponent = {<DeleteSpotModal spotId = {spot.id}/>}
                 buttonText = {'Delete Spot'}
                 onModalClose={closeModal}/>
                 </div>
            ))}
        </div>
    );
}

export default Spots;