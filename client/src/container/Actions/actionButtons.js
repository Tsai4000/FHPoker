import React, { useCallback } from "react"
import { makeStyles } from '@material-ui/core'
import Slide from './component/slide'
import Button from '@material-ui/core/Button';

const useStyle = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0
  },
  margin: {
    margin: theme.spacing(1),
  }
}))

export default function ActionButtons(props) {
  const classes = useStyle()
  return (
    <div className={classes.root}>
      <Slide />
      <Button variant="outlined" size="large" color="primary" className={classes.margin}>
        Check
      </Button>
      <Button variant="outlined" size="large" color="primary" className={classes.margin}>
        Call
      </Button>
      <Button variant="outlined" size="large" color="primary" className={classes.margin}>
        {`Raise ${10}`}
      </Button>
    </div>
  )
}