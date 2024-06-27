// frontend/src/store/session.js
import { csrfFetch } from './csrf';

export const SET_USER = "session/setUser";
export const REMOVE_USER = "session/removeUser";

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
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
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = (user) => async (dispatch) => {
    const {id, firstName, lastName, email, username} = user;
    const response = await csrfFetch("/api/session", {
      method: "DELETE",
      body: JSON.stringify({
        id,
        firstName,
        lastName,
        email,
        username
      })
    });
    const data = await response.json();
    dispatch(removeUser(data.user));
    return response;
  };

  // frontend/src/store/session.js

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
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;