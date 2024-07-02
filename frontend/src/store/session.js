// frontend/src/store/session.js
import { csrfFetch } from './csrf';

export const SET_USER = "session/setUser";
export const REMOVE_USER = "session/removeUser";
export const SET_ERRORS = "session/setErrors";

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

export const setErrors = (error) => {
  return {
    type: SET_ERRORS,
    payload: error
  };
};


export const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};


export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};
// ...

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
 // try{
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    });
    console.log('success', response)
    if(response.ok){
      const data = await response.json();

      dispatch(setUser(data.user));
      return response;
    }
   
}


export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  dispatch(removeUser());
  return response;
};


export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };
  // ...

const initialState = { user: null };

export const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:{
      return { ...state, user: action.payload };
    }
    case REMOVE_USER:{
      return { ...state, user: null };
    }
    case SET_ERRORS:{
       const errors = {...action.payload}
       return errors;
      }
    default:
      return state;
  }
};

export default sessionReducer;