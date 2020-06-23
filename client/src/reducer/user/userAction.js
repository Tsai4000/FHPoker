export const SET_MONEY = 'SET_MONEY'
export const SET_NAME = 'SET_NAME'
export const SET_SITON = 'SET_SITON'
export const SET_IS_READY = 'SET_IS_READY'
export const SET_SELF_CARD = 'SET_SELF_CARD'

export function setMoney(money) {
  return { type: SET_MONEY, money }
}

export function setName(name) {
  return { type: SET_NAME, name }
}

export function setSitOn(sitOn) {
  return { type: SET_SITON, sitOn }
}

export function setIsReady(isReady) {
  return { type: SET_IS_READY, isReady }
}

export function setSelfCard(selfCard) {
  return { type: SET_SELF_CARD, selfCard }
}