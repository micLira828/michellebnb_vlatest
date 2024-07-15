import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../../store/spot';
import { useModal } from '../../../context/Modal';
import { Link } from 'react-router-dom';
import OpenModalButton from '../../OpenModalButton';
import DeleteSpotModal from '../../DeleteSpotModal';
import Card from '../Card';
import '../Spots.css';

const ManageSpots = () => {
    const dispatch = useDispatch();
    let sessionUser = useSelector((state) => state.session.user);
    const {closeModal} = useModal();
     
    const spots = useSelector((state) => state.spots.allSpots);

    const usersSpots = spots.filter(spot => {
        return spot.ownerId === sessionUser.id;
    })

    
    useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);

    return (
        <div className = "spots">
             {usersSpots ? usersSpots.map((spot) => (
                <div key = {spot.name}>
                 <Card  spot={spot}/>
                 <Link to = {`/spots/${spot.id}/edit`} ><button>Update Spot</button></Link>
                 <OpenModalButton 
                 modalComponent = {<DeleteSpotModal spotId = {spot.id}/>}
                 buttonText = {'Delete Spot'}
                 onModalClose={closeModal}/>
                 </div>
            )) : (<>
            <h2>Hey there! You have no spots yet!</h2>
            <Link to = "spots/new">Create one here</Link>
            </>)}
        </div>
    );
}

export default ManageSpots;