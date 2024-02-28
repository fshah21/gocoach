import { SET_USER_ID } from './actionTypes';
import { SET_USER_NAME } from './actionTypes';
import { LOGOUT_USER } from './actionTypes';

let initialState = {
  userId: null,
  userName: null
};

const UserReducer = (state = initialState, action) => {
  console.log("ACTION IN USER REDUCER", action);
  switch (action.type) {
    case SET_USER_ID:     
      return {
        ...state,
        userId: action.payload,
      };
    case SET_USER_NAME:     
      return {
        ...state,
        userName: action.payload,
      };
    case LOGOUT_USER:
        return {
          userId: null,
          userName: null,
        };
    default:
      return state;
  }
};

export default UserReducer;