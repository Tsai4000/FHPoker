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
  const { selfBet } = useSelector((state) => ({ selfBet: state.table.selfBet }))
  const { sitOn, money } = useSelector((state) => ({ sitOn: state.user.sitOn, moeny: state.user.money }))

  const handleClick = useCallback(() => {
    props.type === 'raise' && selfBet >= money
      ? props.socket.emit(props.type, { seat: sitOn, bet: selfBet })
      : props.socket.emit(props.type, { seat: sitOn })
  }, [])

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