import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from "react-redux";
import { setSelfCard } from '../../../reducer/user/userAction'
const useStyle = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: 200
  }
}))

export default function ActionButtons(props) {
  const classes = useStyle()
  const dispatch = useDispatch()
  // TODO: allin 後無法做動作
  const { selfBet, bet, bb } = useSelector((state) => ({ selfBet: state.table.selfBet, bet: state.table.bet, bb: state.table.bb }))
  const { sitOn, money } = useSelector((state) => ({ sitOn: state.user.sitOn, money: state.user.money }))
  const { seats } = useSelector((state) => ({ seats: state.seats.seats }))
  const handleClick = useCallback(() => {
    console.log(`click ${props.type}`)
    if (props.type === 'raise') {
      if (selfBet >= money) {
        props.socket.emit('allin', { seat: sitOn })
      } else if (selfBet >= bet + bb) {
        props.socket.emit(props.type, { seat: sitOn, bet: selfBet })
      }
    } else {
      if (props.type === 'fold') {
        dispatch(setSelfCard(null))
      }
      props.socket.emit(props.type, { seat: sitOn })
    }
  }, [dispatch, money, selfBet, sitOn, bet, bb, seats])

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