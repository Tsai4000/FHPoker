import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: 200
  }
}))

export default function ActionButtons(props) {
  const classes = useStyle()
  const { selfBet, bet, bb } = useSelector((state) => ({ selfBet: state.table.selfBet, bet: state.table.bet, bb: state.table.bb }))
  const { sitOn, money } = useSelector((state) => ({ sitOn: state.user.sitOn, money: state.user.money }))

  const handleClick = useCallback(() => {
    console.log(selfBet, money)
    if (props.type === 'raise' && selfBet > bet + bb) {
      if (selfBet >= money) {
        props.socket.emit('allin', { seat: sitOn })
      } else {
        props.socket.emit(props.type, { seat: sitOn, bet: selfBet })
      }
    } else {
      props.socket.emit(props.type, { seat: sitOn })
    }
  }, [money, selfBet, sitOn])

  return (
    <>
      <Button
        className={classes.margin}
        variant="outlined"
        size="large"
        color="primary"
        onClick={handleClick}
      >
        {props.type === 'raise' ? `${props.type} $${selfBet}` : props.type}
      </Button>
    </>
  )
}