import { SET_SEATS } from './seatsAction'


export default function seatReducer(state = {}, action) {
  switch (action.type) {
    case SET_SEATS:
      return { ...state, ...action.seats }
    default:
      return state
  }
}
