import { csrfFetch } from "./csrf";

export const GET_ALL_SPOTS = "spots/getAllSpots";
export const GET_ONE_SPOT = "spots/getOneSpot";
export const ADD_SPOT = "spots/postSpot";

//regular action creator
const loadSpots = (spots) => {
    return {
      type: GET_ALL_SPOTS,
      payload: spots
    };
  };

  //regular action creator
export const loadSpot = (spot) => {
  return {
    type: GET_ONE_SPOT,
    payload:spot
  };
};

export const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    payload: spot
  };
};


// thunk action creator
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots/');


    if(response.ok){
      const data = await response.json();
      // console.log('The data is', data.Spots);
      dispatch(loadSpots(data.Spots));
      return data;
    }
    
  };

  // thunk action creator
export const getOneSpot = (spotId) => async (dispatch) => {

  const response = await fetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    console.log('The data is', data)
    dispatch(loadSpot(data));
  
    return data;
  }
};

export const postSpot = (spot) => async(dispatch) => {

  const {name, address, city, state, country, description, lat, lng, price} = spot;

  let options = {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
       name: name,
       city: city,
       state:state,
       address:address,
       country: country,
       description: description,
       price: parseFloat(price),
       lat: parseFloat(lat),
       lng: parseFloat(lng)
    })
   }
   
   const response = await csrfFetch('/api/spots', options);
   console.log(await response.json())
   
 
   if(response.ok){
     const data = await response.json();
     dispatch(addSpot(data))
     return data;
   }
 }

  // state object
const initialState = {
  byId: {},
  allSpots: []
};

// reducer
const spotsReducer = (state = initialState, action) => {
   let newState;
  switch (action.type) {
    case GET_ALL_SPOTS: {
      newState = {...state};
      let spots = action.payload
      newState.allSpots = spots
      let newById = {}
      for(let spot of spots){
        /*Adding key value pair 
        where spot id is key and 
        spot is value*/
        newById[spot.id] = spot 
      }
      newState.byId = newById;
      return newState;
    }
    case GET_ONE_SPOT: {
      newState = {...state};
      const spot = action.payload;
      console.log(spot);
      let newById = {};
      newById[spot.id] = spot;
      newState.byId = newById;
      //newState[allSpots] = [spot];
      return newState;
    }
    case ADD_SPOT: {
     newState = {...state};
     //Add new spot to byId 
     const spot = action.payload;
     newState.byId = {...state.byId};
     const spotId = spot.id;
     newState.byId[spotId] = spot;
     newState.allSpots = [...state.allSpots, spot];
     return newState;
    }

    default:
      return state;
  }
};

export default spotsReducer;