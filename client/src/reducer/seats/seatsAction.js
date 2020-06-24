export const GET_SEATS = 'GET_SEATS'
export const SET_SEATS = 'SET_SEATS'


export function getSeats() {
  return { type: GET_SEATS }
}

export function setSeats(seats) {
  return { type: SET_SEATS, seats }
}