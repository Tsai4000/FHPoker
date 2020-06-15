import React, { useCallback, useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Seat from "../Seat/seat"
import { makeStyles } from "@material-ui/core/styles"
import Background from './img/canvas.png'
import Card from '../Card/card'
import PublicCards from './component/publicCards'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    background: `url(${Background}) no-repeat`,
    backgroundSize: '100% 100%',
  },
}))

export default function Table() {
  const classes = useStyles()

  const [pool, setPool] = useState(0)
  const [bet, setBet] = useState(0)
  const [publicCards, setPublicCards] = useState([])
  const [players, setPlayers] = useState({})

  const textContainerStyle = { fontSize: 20, textShadow: '0px 0px 3px  #ffffff', textAlign: "center" }
  const seat = ['seat0', 'seat1', 'seat2', 'seat3', 'seat4', 'seat5', 'seat6', 'seat7']
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid
            container
            xs={3}
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            spacing={5}
          >
            <Grid item xs={4}>
              <Seat id={seat[1]} player={players[seat[1]]} />
            </Grid>
            <Grid item xs={4}>
              <Seat id={seat[2]} player={players[seat[2]]} />
            </Grid>
          </Grid>
          <Grid
            container
            xs={5}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={10}>
              <PublicCards cards={publicCards}></PublicCards>
            </Grid>
            <Grid item xs={4}>
              <div style={textContainerStyle}>{`pool: ${pool}`}</div>
            </Grid>
            <Grid item xs={4}>
              <div style={textContainerStyle}>{`bet: ${bet}`}</div>
            </Grid>
          </Grid>
          <Grid
            container
            xs={3}
            direction="column"
            justify="space-between"
            alignItems="center"
            spacing={5}
          >
            <Grid item xs={4}>
              <Seat id={seat[7]} player={players[seat[3]]} />
            </Grid>
            <Grid item xs={4}>
              <Seat id={seat[6]} player={players[seat[4]]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={8}
          direction="row"
          justify="space-around"
          alignItems="flex-end"
        >
          <Grid item>
            <Seat id={seat[3]} player={players[seat[5]]} />
          </Grid>
          <Grid item>
            <Seat id={seat[4]} player={players[seat[6]]} />
          </Grid>
          <Grid item>
            <Seat id={seat[5]} player={players[seat[7]]} />
          </Grid>
        </Grid>
      </Grid>
    </div >
  )
}
