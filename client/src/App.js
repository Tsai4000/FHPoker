import React, { useState, useCallback, useEffect } from "react"
import "./App.css"
import io from "socket.io-client"
import Table from "./container/Table/table"
import Login from './container/Login/login'
import ActionButtons from './container/Actions/actionButtons'
import { useSelector, useDispatch } from 'react-redux';
import { setSeats } from './reducer/seats/seatsAction'
import { setName, setMoney, setSitOn, setIsReady, setSelfCard } from './reducer/user/userAction'
import { setPool, setButton, setBB, setBet, setPublicCards, setTurn, setSelfBet, setIsPlaying } from './reducer/table/tableAction'

function SocketApp() {
  const dispatch = useDispatch()
  const { seats } = useSelector(state => ({
    seats: state.seats.seats
  }))
  const { turn, selfBet } = useSelector(state => ({
    turn: state.table.turn,
    selfBet: state.table.selfBet
  }))
  const { name, money, sitOn, selfCard } = useSelector((state) => ({
    name: state.user.name,
    money: state.user.money,
    sitOn: state.user.sitOn,
    selfCard: state.user.selfCard
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
        dispatch(setSelfBet(msg[seat].bet))
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
        case 'bb':
          dispatch(setBB(msg[key]))
          break
        default:
          return null
      }
    })
    dispatch(setSeats(msg))
  }, [dispatch])

  const cards_update = useCallback((msg) => {
    console.log('cards_update')
    dispatch(setSelfCard(msg.selfCard))
  }, [dispatch])

  const result_update = useCallback((msg) => {
    console.log('result_update')
    let winner = null
    let maxScore = 0
    Object.keys(msg).forEach((key) => {
      console.log(msg[key])
      if (msg[key][0] > maxScore) {
        winner = key
      }
    })
    console.log(`Winner is ${seats[winner].name}`)
  }, [dispatch, seats])

  const game_playing = useCallback((msg) => {
    console.log('game_playing')
    dispatch(setIsPlaying(msg.playing))
    if (msg.playing) {
      dispatch(setSelfCard(null))
    }
  }, [dispatch])

  useEffect(() => {
    if (socket != null) {
      socket.off('player_update')
      socket.on('player_update', player_update)
    }
  }, [socket, player_update])
  useEffect(() => {
    if (socket != null) {
      socket.off('table_update')
      socket.on('table_update', table_update)
    }
  }, [socket, table_update])
  useEffect(() => {
    if (socket != null) {
      socket.off('cards_update')
      socket.on('cards_update', cards_update)
    }
  }, [socket, cards_update])
  useEffect(() => {
    if (socket != null) {
      socket.off('result_update')
      socket.on('result_update', result_update)
    }
  }, [socket, result_update])
  useEffect(() => {
    if (socket != null) {
      socket.off('game_playing')
      socket.on('game_playing', game_playing)
    }
  }, [socket, game_playing])

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
    // TODO: fix can click without login
    socket.emit('sit', data)
  }, [socket])

  const ready = useCallback((data) => {
    socket.emit('click_ready', data)
  }, [socket])

  const emit = useCallback((type, data) => {
    console.log(type, data, turn)
    if (turn === data.seat) {
      console.log(`emit ${type}`)
      socket.emit(type, data)
    }
  }, [socket, turn])

  const funcs = { sitDown, ready, emit }

  return (
    <div>
      <h1>POKER</h1>
      <Table socket={funcs} />
      {!name && !money ? <Login login={login} /> : null}
      {!name ? null : <div>{`name: ${name}`}</div>}
      {money === null ? null : <div>{`money: ${money}`}</div>}
      {!sitOn ? null : <div>{`sit on ${sitOn}`}</div>}
      {!turn ? null : <div>{`turn: ${turn}`}</div>}
      {!selfBet ? null : <div>{`selfBet: ${selfBet}`}</div>}
      {name && money !== null && sitOn ? <ActionButtons socket={funcs} /> : null}
    </div>
  )
}

export default SocketApp
