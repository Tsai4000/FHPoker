import React, { useState, useCallback } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Paper } from '@material-ui/core'

const useStyle = makeStyles((theme) => ({
  root: {
    width: 160,
    height: 20,
    bottom: 40,
    right: 40,
    position: "absolute"
  },
  name: {
    width: '100%',
    height: '100%',
    textAlign: 'left',
    backgroundColor: "#A3A4A5"
  }
}))


export default function NameUI(props) {
  const classes = useStyle()


  return (
    <div className={classes.root}>
      <Paper className={classes.name} variant="outlined" elevation={3}>{props.name}</Paper>
    </div>
  )
}