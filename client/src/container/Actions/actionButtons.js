import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import Slide from './component/slide'
import Button from './component/button'

const useStyle = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0
  },
  margin: {
    margin: theme.spacing(1),
  }
}))

export default function ActionButtons(props) {
  const classes = useStyle()
  return (
    <div className={classes.root}>
      <Slide />
      <Button type={'raise'} socket={props.socket} />
      <Button type={'check'} socket={props.socket} />
      <Button type={'call'} socket={props.socket} />
      <Button type={'fold'} socket={props.socket} />
    </div>
  )
}