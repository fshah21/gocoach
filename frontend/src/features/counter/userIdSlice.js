// import { createSlice } from '@reduxjs/toolkit'

// export const userIdSlice = createSlice({
//   name: 'userId',
//   initialState: {
//     value: null
//   },
//   reducers: {
//     setUserId: (state, action) => {
//       console.log("ACTION", action);
//       console.log("PAYLOAD", action.payload);
//       // Use action.payload to set the value
//       state.value = action.payload;
//     },
//     extraReducers: (builder) => {
//       builder.addDefaultCase((state) => state);
//     },
//   }
// })

// // Action creators are generated for each case reducer function
// export const { setUserId } = userIdSlice.actions

// export default userIdSlice.reducer

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