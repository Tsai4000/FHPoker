import { SET_SEATS } from './seatsAction'

const initState = {
  seats: {}
}

export default function seatsReducer(state = initState, action) {
  switch (action.type) {
    case SET_SEATS:
      return { ...state, seats: action.seats }
    default:
      return state
  }
}
