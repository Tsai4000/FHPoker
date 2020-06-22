import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import { useDispatch, useSelector } from "react-redux";
import { setSelfBet } from '../../../reducer/table/tableAction';

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 70,
  },
})

export default function InputSlider(props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [value, setValue] = React.useState(0)
  const { money } = useSelector((state) => ({ money: state.user.money }))
  const { bet, bb } = useSelector((state) => ({ bet: state.table.bet, bb: state.table.bb }))

  useEffect(() => {
    dispatch(setSelfBet(value))
  }, [value])
  const handleSliderChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    if (value < bet + bb) {
      setValue(bet + bb)
    } else if (value > money) {
      setValue(money)
    }
  }

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Bet
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <AttachMoneyIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={value}
            step={1}
            min={bet + bb}
            max={money}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="linear-slider"
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 0.1,
              min: bet + bb,
              max: money,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}
