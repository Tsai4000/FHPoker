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
    height: '100%'
  }
}))


export default function StatusUI(props) {
  const classes = useStyle()


  return (
    <div className={classes.root}>
      <Avatar className={classes.status}>{props.status}</Avatar>
    </div>
  )
}