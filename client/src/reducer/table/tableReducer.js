import { SET_POOL, SET_BB, SET_BET, SET_BUTTON, SET_PUBLIC_CARDS, SET_START_PLAYER, SET_TURN } from './tableAction'

const initState = {
  pool: 0,
  bet: 0,
  bb: 0,
  button: '',
  publicCards: [],
  startPlayer: '',
  turn: ''
}

export default function seatReducer(state = initState, action) {
  switch (action.type) {
    case SET_POOL:
      return { ...state, ...action.pool }
    case SET_BB:
      return { ...state, ...action.bb }
    case SET_BET:
      return { ...state, ...action.bet }
    case SET_BUTTON:
      return { ...state, ...action.button }
    case SET_PUBLIC_CARDS:
      return { ...state, ...action.publicCards }
    case SET_START_PLAYER:
      return { ...state, ...action.startPlayer }
    case SET_TURN:
      return { ...state, ...action.turn }
    default:
      return state
  }
}
