import { SET_POOL, SET_BB, SET_BET, SET_BUTTON, SET_PUBLIC_CARDS, SET_SELF_BET, SET_START_PLAYER, SET_TURN } from './tableAction'

const initState = {
  pool: 0,
  bet: 0,
  bb: 0,
  button: '',
  publicCards: [],
  selfBet: 0,
  startPlayer: '',
  turn: ''
}

export default function seatReducer(state = initState, action) {
  switch (action.type) {
    case SET_POOL:
      return { ...state, pool: action.pool }
    case SET_BB:
      return { ...state, bb: action.bb }
    case SET_BET:
      return { ...state, bet: action.bet }
    case SET_BUTTON:
      return { ...state, button: action.button }
    case SET_PUBLIC_CARDS:
      return { ...state, publicCards: action.publicCards }
    case SET_SELF_BET:
      return { ...state, selfBet: action.selfBet }
    case SET_START_PLAYER:
      return { ...state, startPlayer: action.startPlayer }
    case SET_TURN:
      return { ...state, turn: action.turn }
    default:
      return state
  }
}
