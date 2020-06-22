import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: 300
  }
}))

export default function ActionButtons(props) {
  const classes = useStyle()
  const { selfBet } = useSelector((state) => ({ selfBet: state.table.selfBet }))
  const { sitOn, money } = useSelector((state) => ({ selfBet: state.user.sitOn, moeny: state.user.money }))


  const handleClick = function (type) {
    switch (type) {
      case 'check':
        props.socket.emit(type, { seat: sitOn })
      case 'call':
        props.socket.emit(type, { seat: sitOn })
      case 'raise':
        if (selfBet >= money) {
          props.socket.emit(type, { seat: sitOn })
        } else {
          props.socket.emit(type, { seat: sitOn, bet: selfBet })
        }
      case 'fold':
        props.socket.emit(type, { seat: sitOn })
      default:
        return null
    }
  }

  return (
    <>
      <Button
        className={classes.margin}
        variant="outlined"
        size="large"
        color="primary"
        onClick={handleClick(props.type)}
      >
        {props.type === 'rasie' ? `${props.type} $${selfBet}` : props.type}
      </Button>
    </>
  )
}