import React, { useState, useCallback } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Paper } from "@material-ui/core"

const useStyle = makeStyles((theme) => ({
  root: {
    width: 140,
    height: 20,
    bottom: 10,
    right: 40,
    position: "absolute"
  },
  money: {
    width: '100%',
    height: '100%',
    textAlign: 'left',
    backgroundColor: "#A3A4A5"
  }
}))


export default function MoneyUI(props) {
  const classes = useStyle()


  return (
    <div className={classes.root}>
      <Paper className={classes.money} variant="outlined" elevation={3}>{props.money}</Paper>
    </div>
  )
}