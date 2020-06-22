import React, { useState, useCallback, useEffect } from "react"
import "./App.css"
import io from "socket.io-client"
import Table from "./container/Table/table"
import Login from './container/Login/login'
import ActionButtons from './container/Actions/actionButtons'
import { useSelector, useDispatch } from 'react-redux';
import { setSeats } from './reducer/seats/seatsAction'
import { setName, setMoney, setSitOn, setIsReady } from './reducer/user/userAction'
import { setPool, setButton, setBet, setPublicCards, setTurn } from './reducer/table/tableAction'

function SocketApp() {
  const dispatch = useDispatch()
  const { seats } = useSelector(state => ({
    seats: state.seats.seats
  }))
  const { turn } = useSelector(state => ({
    turn: state.table.turn
  }))
  const { name, money, sitOn } = useSelector((state) => ({
    name: state.user.name,
    money: state.user.money,
    sitOn: state.user.sitOn
  }))

  const [socket, setSocket] = useState(null)

  const player_update = useCallback((msg) => {
    console.log('player_update')
    Object.keys(msg).forEach((seat) => {
      if (msg[seat].name === name) {
        console.log(name, msg[seat], msg[seat].isReady, msg[seat].money)
        dispatch(setSitOn(seat))
        dispatch(setIsReady(msg[seat].isReady))
        dispatch(setMoney(msg[seat].money))
      }
    })
    dispatch(setSeats(msg))
  }, [dispatch, name])

  const table_update = useCallback((msg) => {
    console.log('table_update')
    Object.keys(msg).forEach((key) => {
      switch (key) {
        case 'turn':
          dispatch(setTurn(msg[key]))
          break
        case 'button':
          dispatch(setButton(msg[key]))
          break
        case 'publicCards':
          dispatch(setPublicCards(msg[key]))
          break
        case 'pool':
          dispatch(setPool(msg[key]))
          break
        case 'bet':
          dispatch(setBet(msg[key]))
          break
        default:
          return null
      }
    })
    dispatch(setSeats(msg))
  }, [dispatch])

  const cards_update = useCallback((msg) => {
    console.log('cards_update')
    Object.keys(seats).forEach((key) => {
      if (seats[key].name === name) {
        const handupdate = seats
        handupdate[key].hand = msg.selfCard
        console.log(handupdate)
        dispatch(setSeats(handupdate))
      }
    })
  }, [dispatch, seats, name])

  useEffect(() => {
    if (socket != null) {
      socket.on('player_update', player_update)
    }
  }, [socket, player_update])
  useEffect(() => {
    if (socket != null) {
      socket.on('table_update', table_update)
    }
  }, [socket, table_update])
  useEffect(() => {
    if (socket != null) {
      socket.on('cards_update', cards_update)
    }
  }, [socket, cards_update])

  const login = useCallback((username, userCode) => {
    fetch(`http://${document.domain}:5000/login`, {
      method: 'POST',
      body: JSON.stringify({
        name: username,
        userCode: userCode
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp) => {
      if (resp.status === 200) {
        setSocket(io.connect(`${document.domain}:5000`))
        return resp.json()
      } else {
        alert('Login Failed')
        return null
      }
    }).then((body) => {
      if (body) {
        dispatch(setName(body.name))
        dispatch(setMoney(body.money))
      }
    })
  }, [setSocket, dispatch])

  const sitDown = useCallback((data) => {
    socket.emit('sit', data)
  }, [socket])

  const ready = useCallback((data) => {
    socket.emit('click_ready', data)
  }, [socket])

  const emit = useCallback((type, data) => {
    socket.emit(type, data)
  }, [socket])

  const funcs = { sitDown, ready, emit }

  return (
    <div>
      <h1>POKER</h1>
      <Table socket={funcs} />
      {!name && !money ? <Login login={login} /> : null}
      {!name ? null : <div>{`name: ${name}`}</div>}
      {!money ? null : <div>{`money: ${money}`}</div>}
      {!sitOn ? null : <div>{`sit on ${sitOn}`}</div>}
      {!turn ? null : <div>{`turn: ${turn}`}</div>}
      {name && money && sitOn ? <ActionButtons socket={funcs} /> : null}
    </div>
  )
}

export default SocketApp
