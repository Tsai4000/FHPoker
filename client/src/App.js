import React, { useState, useCallback, useEffect } from "react"
import "./App.css"
import io from "socket.io-client"
import Table from "./container/Table/table"
import Login from './container/Login/login'
import ActionButtons from './container/Actions/actionButtons'
import { useSelector, useDispatch } from 'react-redux';
import { setSeats } from './reducer/seats/seatsAction'
import { setName, setMoney, setSitOn, setIsReady } from './reducer/user/userAction'

function SocketApp() {
  const dispatch = useDispatch()
  const { name, money, sitOn } = useSelector(state => ({
    name: state.user.name,
    money: state.user.money,
    sitOn: state.user.sitOn
  }))

  const [socket, setSocket] = useState(null)

  const player_update = useCallback((msg) => {
    console.log('player_update')
    Object.keys(msg).forEach((seat) => {
      if (msg[seat].name === name) {
        dispatch(setSitOn(seat))
        dispatch(setIsReady(msg[seat].isReady))
      }
    })
    dispatch(setSeats(msg))
  }, [dispatch, name])

  useEffect(() => {
    if (socket != null) {
      socket.on('player_update', player_update)
    }
  }, [socket, player_update])

  const login = useCallback((name, userCode) => {
    fetch(`http://${document.domain}:5000/login`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
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

  const funcs = { sitDown, ready }

  return (
    <div>
      <h1>POKER</h1>
      <Table socket={funcs} />
      {!name && !money ? <Login login={login} /> : null}
      {!name ? null : <div>{`name: ${name}`}</div>}
      {!money ? null : <div>{`money: ${money}`}</div>}
      {!sitOn ? null : <div>{`sit on ${sitOn}`}</div>}
      <ActionButtons />
    </div>
  )
}

export default SocketApp
