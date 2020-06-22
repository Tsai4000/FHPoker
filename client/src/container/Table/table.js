import React, { useCallback, useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Seat from "../Seat/seat"
import { makeStyles } from "@material-ui/core/styles"
import Background from './img/canvas.png'
import PublicCards from './component/publicCards'
import { useDispatch, useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    background: `url(${Background}) no-repeat`,
    backgroundSize: '100% 100%',
  },
}))

export default function Table(props) {
  const classes = useStyles()
  const { seats } = useSelector(state => ({ seats: state.seats.seats }))
  const { pool, bet, publicCards } = useSelector(state => ({
    pool: state.table.pool,
    bet: state.table.bet,
    publicCards: state.table.publicCards
  }))

  const textContainerStyle = { fontSize: 35, textShadow: '0px 0px 3px  #ffffff', textAlign: "center" }
  const seatList = ['seat0', 'seat1', 'seat2', 'seat3', 'seat4', 'seat5', 'seat6', 'seat7']

  const getPlayerBySeat = useCallback((seat) => {
    return seats.hasOwnProperty(seat) ? seats[seat] : null
  }, [seats])

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
              <Seat id={seatList[1]} player={getPlayerBySeat(seatList[1])} socket={props.socket} />
            </Grid>
            <Grid item xs={4}>
              <Seat id={seatList[2]} player={getPlayerBySeat(seatList[2])} socket={props.socket} />
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
              <Seat id={seatList[7]} player={getPlayerBySeat(seatList[7])} socket={props.socket} />
            </Grid>
            <Grid item xs={4}>
              <Seat id={seatList[6]} player={getPlayerBySeat(seatList[6])} socket={props.socket} />
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
            <Seat id={seatList[3]} player={getPlayerBySeat(seatList[3])} socket={props.socket} />
          </Grid>
          <Grid item>
            <Seat id={seatList[4]} player={getPlayerBySeat(seatList[4])} socket={props.socket} />
          </Grid>
          <Grid item>
            <Seat id={seatList[5]} player={getPlayerBySeat(seatList[5])} socket={props.socket} />
          </Grid>
        </Grid>
      </Grid>
    </div >
  )
}
