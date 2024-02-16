import { SET_USER_ID } from './actionTypes';

let initialState = {
  userId: null,
};

const UserReducer = (state = initialState, action) => {
  console.log("ACTION IN USER REDUCER", action);
  switch (action.type) {
    case SET_USER_ID:     
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};

export default UserReducer;