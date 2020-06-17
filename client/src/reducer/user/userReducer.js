import { SET_NAME, SET_MONEY, SET_SITON, SET_IS_READY } from './userAction'

const initState = {
  name: null,
  money: null,
  sitOn: null,
  isReady: null
}


export default function seatReducer(state = initState, action) {
  switch (action.type) {
    case SET_NAME:
      return { ...state, name: action.name }
    case SET_MONEY:
      return { ...state, money: action.money }
    case SET_SITON:
      return { ...state, sitOn: action.sitOn }
    case SET_IS_READY:
      return { ...state, isReady: action.isReady }
    default:
      return state
  }
}
