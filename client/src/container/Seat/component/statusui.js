import React, { useState, useCallback } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Avatar from '@material-ui/core/Avatar';

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

  const [status, setStatus] = useState(props.status)

  const mouseOver = useCallback((e) => {
    if (status == '') {
      e.target.style.backgroundColor = 'black'
      setStatus('Ready?')
    } else if (status == 'empty') {
      e.target.style.backgroundColor = 'black'
      setStatus('Sit?')
    }
  }, [status, setStatus])
  const mouseOut = useCallback((e) => {
    if (status == 'Ready?') {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('')
    } else if (status == 'Sit?') {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('empty')
    }
  }, [status, setStatus])

  const click = useCallback((e) => {
    if (status == 'Sit?') {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('')
    } else if (status == 'Ready?') {
      e.target.style.backgroundColor = '#bdbdbd'
      setStatus('Waiting')
    }
  }, [status, setStatus])

  return (
    <div className={classes.root}>
      <Avatar className={classes.status} onMouseOver={mouseOver} onMouseOut={mouseOut} onClick={click}>{status}</Avatar>
    </div>
  )
}