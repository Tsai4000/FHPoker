import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import { SvgIcon } from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'
import FavoriteIcon from '@material-ui/icons/Favorite'
import StopIcon from '@material-ui/icons/Stop'

const useStyle = makeStyles((theme) => ({
  box: {
    width: 40,
    height: 40,
    position: 'relative',
    textAlign: 'center',
    margin: '0px auto'
  },
  component: {
    position: "absolute"
  }
}))


export default function Suit(props) {
  const classes = useStyle()

  const spade = useCallback(() => {
    return (
      <div className={classes.box}>
        <FiberManualRecordIcon className={classes.component} style={{ top: 0, left: 8 }}></FiberManualRecordIcon>
        <FiberManualRecordIcon className={classes.component} style={{ top: 12, left: 0 }}></FiberManualRecordIcon>
        <FiberManualRecordIcon className={classes.component} style={{ top: 12, left: 16 }}></FiberManualRecordIcon>
        <DeviceHubIcon className={classes.component} style={{ top: 20, left: 8 }}></DeviceHubIcon>
      </div>
    )
  })
  const heart = useCallback(() => {
    return (
      <div className={classes.box}>
        <FavoriteIcon fontSize={'large'} style={{ color: 'red' }}></FavoriteIcon>
      </div>
    )
  })
  const club = useCallback(() => {
    return (
      <div className={classes.box}>
        <FavoriteIcon fontSize={'large'} style={{ color: 'black', transform: 'rotate(180deg)' }}></FavoriteIcon>
        <DeviceHubIcon className={classes.component} style={{ top: 20, left: 8 }}></DeviceHubIcon>
      </div>
    )
  })
  const diamond = useCallback(() => {
    return (
      <div className={classes.box}>
        <StopIcon fontSize={'large'} style={{ color: 'red', transform: 'rotate(45deg)' }}></StopIcon>
      </div>
    )
  })


  return (
    <div>
      {props.suit == "club" ? club()
        : props.suit == "heart" ? heart()
          : props.suit == "diamond" ? diamond()
            : props.suit == "spade" ? spade()
              : 'none'}
    </div>
  )
}