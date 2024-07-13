import { body } from "express-validator";
import { csrfFetch } from "./csrf";

export const GET_ALL_REVIEWS = "reviews/getAllReviews";
export const GET_ONE_REVIEW = "reviews/getOneReview";
export const ADD_REVIEW = "reviews/postReview";
export const EDIT_REVIEW = "reviews/updateReview";
export const DELETE_REVIEW = "reviews/removeReview";
export const GET_SPOT_REVIEWS = "reviews/getSpotReviews";


  //regular action creator
export const loadReview = (review) => {
  return {
    type: GET_ONE_REVIEW,
    payload:review
  };
};

  //regular action creator
  export const loadSpotReviews = (reviews) => {
    return {
      type: GET_SPOT_REVIEWS,
      payload: reviews
    };
  };

export const addReview = (review) => {
  return {
    type: ADD_REVIEW,
    payload: review
  };
};

export const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    payload: review
  };
};

  //regular action creator
  export const editReview = (review) => {
    return {
      type: EDIT_REVIEW,
      payload:review
    };
  };

 // thunk action creator
export const getSpotReviews = ({spot}) => async (dispatch) => {
   
  console.log('Spot apples', spot);
    const spotId = spot.id;
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if(response.ok){
      const data = await response.json();
      console.log('The data is', data)
      dispatch(loadSpotReviews(data.Reviews));
      return data;
    }
  };

  // thunk action creator
export const getOneReview = (reviewId) => async (dispatch) => {

  const response = await fetch(`/api/reviews/${reviewId}`);
  if (response.ok) {
    const data = await response.json();
    console.log('The data is', data)
    dispatch(loadReview(data));
  
    return data;
  }
};

export const removeReview = (review) => async(dispatch) => {
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(review)
    }

    console.log('The review is', review);

    const response = await csrfFetch(`/api/reviews/${review}`, options);

    if(response.ok){
      const data = await response.toJSON();
      dispatch(deleteReview(data))
    }
    else{
      throw response;
    }
    
}

export const postReview = (spot, review) => async(dispatch) => {
  console.log('Mary had', spot, 'lambs')
  let options = {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify(review)
   }

   const response = await csrfFetch(`/api/spots/${spot.id}/reviews`, options);
   console.log(await response.json())
   
 
   if(response.ok){
     const data = await response.json();
     dispatch(addReview(data))
     return data;
   }
 }

 export const updateReview = (review) => async(dispatch) => {

  console.log('The review is', review);
  let options = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(review)
  }

  console.log(review.id);
 
  const response = await csrfFetch(`/api/reviews/${review.id}`, options);
  // console.log(await response.json())

  
  if(response.ok){
    const data = await response.json();
    dispatch(editReview(data))
    return data;
  }
 }
  // state object
const initialState = {
  byId: {},
  allReviews: []
};

// reducer
const reviewsReducer = (state = initialState, action) => {
   let newState;
  switch (action.type) {
    case GET_SPOT_REVIEWS: {
      newState = {...state};
      let reviews = action.payload;
      newState.allReviews = reviews;
      let newById = {}
      for(let review of reviews){
        /*Adding key value pair 
        where spot id is key and 
        spot is value*/
        newById[review.id] = review
      }
      newState.byId = newById;
    
      return newState;
    }
    case GET_ONE_REVIEW: {
      newState = {...state};
      const review = action.payload;
      console.log(review);
      let newById = {};
      newById[review.id] = review;
      newState.byId = newById;
      //newState[allSpots] = [spot];
      return newState;
    }
    case ADD_REVIEW: {
     newState = {...state};
     //Add new spot to byId 
     const review = action.payload;
     newState.byId = {...state.byId};
     const reviewId = review.id;
     newState.byId[reviewId] = review;
     newState.allReviews = [...state.allReviews, review];
     return newState;
    }
    case EDIT_REVIEW: {
      newState = {...state};
      //Add new spot to byId 
      const review = action.payload;
      const updatedReviews = newState.allReviews.filter(rev => {
        return rev.id !== review.id;
      });

      updatedReviews.push(review);
      newState.allReviews = updatedReviews;
      console.log(updatedReviews);
      return newState;
    }

    case DELETE_REVIEW: {
      newState = {...state}

      let review = action.payload;

      const newAllReviewsArr = newState.allReviews.filter(rev => {
         return rev.id !== review.id;
      })

      newState.allReviews = newAllReviewsArr;
      delete newState.byId[review.id];
      return newState;
    }
    
    
    default:
      return state;
  }
};

export default reviewsReducer;