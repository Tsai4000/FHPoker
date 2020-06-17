import React, { useState, useCallback, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Avatar from '@material-ui/core/Avatar';
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) => ({
  root: {
    width: 80,
    height: 80,
    bottom: 0,
    right: 0,
    position: "absolute"
  },
  status: {
    width: '100%',
    height: '100%',
    backgroundColor: '#bdbdbd'
  }
}))


export default function StatusUI(props) {
  const classes = useStyle()
  const { name, isReady, sitOn } = useSelector(state => ({
    name: state.user.name,
    isReady: state.user.isReady,
    sitOn: state.user.sitOn
  }))
  const { seats } = useSelector(state => ({ seats: state.seats.seats }))

  const [status, setStatus] = useState('empty')

  useEffect(() => {
    if (sitOn && sitOn != props.id) {
      if (props.player) {
        setStatus(props.player.isReady === false ? 'Ready?' : 'ss')
      } else {
        setStatus('empty')
      }
    }
  }, [seats, sitOn])

  const mouseOver = useCallback((e) => {
    if (status === 'Ready?') {
      e.target.style.backgroundColor = 'black'
      setStatus('Ready')
    } else if (status === 'empty') {
      e.target.style.backgroundColor = 'black'
      setStatus('Sit?')
    }
  }, [status, setStatus])
  const mouseOut = useCallback((e) => {
    if (status === 'Ready') {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('Ready?')
    } else if (status === 'Sit?') {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('empty')
    }
  }, [status, setStatus])

  const click = useCallback((e) => {
    if (status === 'Sit?' && !isReady) {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('Ready?')
      props.socket.sitDown({ seat: props.id, name: name })
    } else if (status === 'Ready' && !isReady) {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('Waiting')
      props.socket.ready({ seat: props.id })
    } else if (status === 'Waiting' && isReady) {
      setStatus('Ready')
      props.socket.ready({ seat: props.id })
    }
  }, [status, setStatus, props, name, isReady])

  return (
    <div className={classes.root}>
      <Avatar className={classes.status} onMouseOver={mouseOver} onMouseOut={mouseOut} onClick={click}>
        {!props.player ? status : props.player.isReady ? 'Waiting' : status}
      </Avatar>
    </div>
  )
}