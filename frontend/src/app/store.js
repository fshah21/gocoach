import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../components/UserReducer'

export default configureStore({
  reducer: {
    user: UserReducer
  }
})