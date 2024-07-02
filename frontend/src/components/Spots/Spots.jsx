import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spot';
import Card from './Card'

const Spots = () => {
    const dispatch = useDispatch();

    const spots = useSelector((state) => state.spot);
    const spotsList = Object.values(spots);


    useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);

    return (
        <>
             {spotsList?.map((spot) => (
                 <Card key = {spot.id} spot={spot}/>
            ))}
        </>
    );
}

export default Spots;