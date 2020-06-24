import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import { Paper } from "@material-ui/core"
import Suit from './component/suit'

const useStyles = makeStyles(() => ({
  root: {
    width: 50,
    height: 80,
    position: "absolute"
  },
  card: {
    width: "100%",
    height: '100%',
    textAlign: 'center'
  }
}))

export default function Card(props) {
  const classes = useStyles()

  const suitList = ['spade', 'heart', 'diamond', 'club']
  const suit = props.number === -1 ? null : props.number === 0 ? 'none' : suitList[Math.floor((props.number - 1) / 13)]
  const number = props.number % 13 === 0 ? 13 : props.number % 13

  const cardBack = useCallback(() => {
    return (
      <Paper className={classes.card} style={{ backgroundColor: 'grey' }} />
    )
  })
  const omote = useCallback(() => {
    return (
      <Paper className={classes.card}>
        <Suit suit={suit} />
        <h4>{`${number}`}</h4>
      </Paper>
    )
  }, [suit, number])


  return (
    <div className={classes.root} style={{ left: props.left }}>
      {!suit ? null : suit === 'none' ? cardBack() : omote()}
    </div>
  )
}