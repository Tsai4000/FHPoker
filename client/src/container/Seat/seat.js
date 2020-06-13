import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import { borderColor } from "@material-ui/system"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 200,
    borderStyle: "solid",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
    backgroundColor: "gray",
  },
  divimg: {
    width: 35,
    height: 60,
  },
  imgstyle: {
    width: "100%",
    height: "100%",
  },
}))

export default function FullWidthGrid() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={0} justify="space-between">
        <Grid item xs={6}>
          <Paper className={classes.paper}>status</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>bet</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>name </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>money </Paper>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.divimg}>
            <img
              src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
              alt=""
              className={classes.imgstyle}
            />
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.divimg}>
            <img
              src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
              alt=""
              className={classes.imgstyle}
            />
          </div>
        </Grid>
        <Grid container item xs={6}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>cardScore </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>cardType </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <div className={classes.divimg}>
              <img
                src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
                alt=""
                className={classes.imgstyle}
              />
            </div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.divimg}>
              <img
                src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
                alt=""
                className={classes.imgstyle}
              />
            </div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.divimg}>
              <img
                src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
                alt=""
                className={classes.imgstyle}
              />
            </div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.divimg}>
              <img
                src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
                alt=""
                className={classes.imgstyle}
              />
            </div>
          </Grid>
          <Grid item xs={2}>
            <div className={classes.divimg}>
              <img
                src="https://cdn.pixabay.com/photo/2015/08/11/11/56/diamonds-884162_960_720.png"
                alt=""
                className={classes.imgstyle}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
