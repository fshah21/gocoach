let initialState = {
  userId: null
}

const UserReducer = (state=initialState, action) => {
  switch (action.type) {        
      case 'setUserId':
          return {
              ...state,
              
          };
      default: 
          return state;
  }
}

export default UserReducer;