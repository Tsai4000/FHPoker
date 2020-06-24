import { combineReducers } from 'redux'
import seatsReducer from './seats/seatsReducer'
import tableReducer from './table/tableReducer'
import userReducer from './user/userReducer'

export default combineReducers({
  seats: seatsReducer,
  table: tableReducer,
  user: userReducer
})
