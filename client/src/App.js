import React, { useState, useCallback, useEffect } from "react"
import "./App.css"
import io from "socket.io-client"
import Table from "./container/Table/table"
import Login from './container/Login/login'
import { useSelector, useDispatch } from 'react-redux';
import { setSeats, getSeats } from './reducer/seats/seatsAction'

function SocketApp() {
  const dispatch = useDispatch()
  // const seats = useSelector(state => state.seats)


  const [socket, setSocket] = useState(null)
  // const [pool, setPool] = useState(0)
  // const [bet, setBet] = useState(0)
  // const [seats, setSeats] = useState({})
  // const [bb, setBB] = useState(0)
  // const [button, setButton] = useState('')
  // const [startPlayer, setStartPlayer] = useState('')
  // const [turn, setTurn] = useState('')
  // const [publicCards, setPublicCards] = useState([])
  const [name, setName] = useState('')
  const [money, setMoney] = useState(null)

  useEffect(() => {
    if (socket != null) {
      socket.on('player_update', player_update)
    }
  }, [socket])

  const player_update = useCallback((msg) => {
    dispatch(setSeats(msg))
  }, [dispatch])

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
        setName(body.name)
        setMoney(body.money)
      }
    })
  }, [setSocket, setName, setMoney])

  const sitDown = useCallback((data) => {
    socket.emit('sit', data)
  }, [socket])

  const funcs = { sitDown: sitDown }

  return (
    <div>
      <h1>POKER</h1>
      <Table socket={funcs} />
      {name == '' && money == null ? <Login login={login} /> : null}
      {name == '' ? null : <div>{`name: ${name}`}</div>}
      {money == null ? null : <div>{`money: ${money}`}</div>}
    </div>
  )
}

export default SocketApp
