import { SET_USER_ID } from './actionTypes';
import { SET_USER_NAME } from './actionTypes';
import { LOGOUT_USER } from './actionTypes';

export const setUserId = (userId) => {
  console.log("ACTION SET USER ID", userId);
  return {
    type: SET_USER_ID,
    payload: userId,
  };
};

export const setUserName = (userName) => {
  console.log("ACTION SET USER NAME", userName);
  return {
    type: SET_USER_NAME,
    payload: userName,
  };
};

export const logoutUser = () => {
  console.log("ACTION LOGOUT USER");
  return {
    type: LOGOUT_USER,
  }
};