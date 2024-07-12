import { body } from "express-validator";
import { csrfFetch } from "./csrf";

export const GET_ALL_SPOT_IMAGES = "spots/getAllSpotImages";
export const ADD_SPOT_IMAGE = "spots/postSpotImage";
// export const EDIT_SPOT_IMAGE = "spots/updateSpotImage";


//regular action creator
const loadSpotImages = (spotImages) => {
    return {
      type: GET_ALL_SPOT_IMAGES,
      payload: spotImages
    };
  };

export const addSpotImage = (spotImage) => {
  return {
    type: ADD_SPOT_IMAGE,
    payload: spotImage
  };
};



//   //regular action creator
//   export const editSpotImage = (spotImage) => {
//     return {
//       type: EDIT_SPOT_IMAGE,
//       payload: spotImage
//     };
//   };

 


// thunk action creator
export const getAllSpotImages = (spot) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spot.id}/images`);


    if(response.ok){
      const data = await response.json();
      dispatch(loadSpotImages(data.SpotImages));
      return data;
    }
    
  };


export const postSpotImage = (image, spotId) => async(dispatch) => {

  const {url, preview} = image;

  let options = {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
        url,
        preview
    })
   }
   
   const response = await csrfFetch(`/api/spots/${spotId}/images`, options);
   console.log(await response.json())
   
 
   if(response.ok){
     const data = await response.json();
     dispatch(addSpotImage(data))
     return data;
   }
 }

//  export const updateSpotImage = (spot) => async(dispatch) => {

//   console.log('The spot is', spot);
//   let options = {
//     method: 'PUT',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(spot)
//   }

//   console.log(spot.id);
 
//   const response = await csrfFetch(`/api/spots/${spot.id}`, options);
//   // console.log(await response.json())

  
//   if(response.ok){
//     const data = await response.json();
//     dispatch(editSpotImage(data))
//     return data;
//   }
//  }
//   // state object
// const initialState = {
//   byId: {},
//   allSpotImages: []
// };

// reducer

const initialState = {};
const spotImagesReducer = (state = initialState, action) => {
   let newState;
  switch (action.type) {
    case GET_ALL_SPOT_IMAGES: {
      newState = {...state};
      let spotImages = action.payload
      newState.allSpotImages = spotImages
      let newById = {}
      for(let image of spotImages){
        /*Adding key value pair 
        where spot id is key and 
        spot is value*/
        newById[image.id] = image
      }
      newState.byId = newById;
      return newState;
    }
    
    case ADD_SPOT_IMAGE: {
     newState = {...state};
     //Add new spot to byId 
     const spotImage = action.payload;
     newState.byId = {...state.byId};
     const imageId = spotImage.id;
     newState.byId[imageId] = spotImage;
     newState.allSpots = [...state.allSpotImages, spotImage];
     return newState;
    }
    // case EDIT_SPOT_IMAGE: {
    //   newState = {...state};
    //   //Add new spot to byId 
    //   const spotImage = action.payload;
    //   const updatedSpotImages = newState.allSpotImages.filter(pic => {
    //     return spotImage.id !== pic.id;
    //   });

    //   updatedSpots.push(spotImage);
    //   newState.allSpotImages = updatedSpotImages;
    //   console.log(updatedSpotImages);
    //   return newState;
    // }

    default:
      return state;
  }
};

export default spotImagesReducer;