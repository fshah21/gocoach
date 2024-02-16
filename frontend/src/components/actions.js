import { SET_USER_ID } from './actionTypes';

export const setUserId = (userId) => {
  console.log("ACTION SET USER ID", userId);
  return {
    type: SET_USER_ID,
    payload: userId,
  };
};