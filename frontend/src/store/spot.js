export const GET_ALL_SPOTS = "spots/getAllSpots";

//regular action creator
const loadSpots = (spots) => {
    return {
      type: GET_ALL_SPOTS,
      spots
    };
  };
  

// thunk action creator
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots/');
  
  
    if (response.ok) {
      const data = await response.json();
      // console.log('The data is', data.Spots);
      dispatch(loadSpots(data.Spots));
      return data;
    }
  };


  // state object
const initialState = {};

// reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = {};
      action.spots.forEach((spot) => (newState[spot.id] = spot));
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;

