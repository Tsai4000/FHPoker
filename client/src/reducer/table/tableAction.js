export const SET_POOL = 'SET_POOL'
export const SET_BET = 'SET_BET'
export const SET_BB = 'SET_BB'
export const SET_BUTTON = 'SET_BUTTON'
export const SET_SELF_BET = 'SET_SELF_BET'
export const SET_START_PLAYER = 'SET_START_PLAYER'
export const SET_TURN = 'SET_TURN'
export const SET_PUBLIC_CARDS = 'SET_PUBLIC_CARDS'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'

export function setPool(pool) {
  return { type: SET_POOL, pool }
}
export function setBet(bet) {
  return { type: SET_BET, bet }
}
export function setBB(bb) {
  return { type: SET_BB, bb }
}
export function setButton(button) {
  return { type: SET_BUTTON, button }
}
export function setSelfBet(selfBet) {
  return { type: SET_SELF_BET, selfBet }
}
export function setStartPlayer(startPlayer) {
  return { type: SET_START_PLAYER, startPlayer }
}
export function setTurn(turn) {
  return { type: SET_TURN, turn }
}
export function setPublicCards(publicCards) {
  return { type: SET_PUBLIC_CARDS, publicCards }
}
export function setIsPlaying(isPlaying) {
  return { type: SET_IS_PLAYING, isPlaying }
}