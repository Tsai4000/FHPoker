import React, { useCallback, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Seat from '../Seat/seat'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		width: "100%",
		height: "100%"
	}
}));

export default function Table() {
	const classes = useStyles();

	const [pool, setPool] = useState(0)
	const [bet, setBet] = useState(0)
	const [publicCards, setPublicCards] = useState([])
	const [players, setPlayers] = useState({})

	const textContainerStyle = { textAlign: "center" }

	return (
		<div className={classes.root}>
			<Grid container
				direction="column"
				justify="space-between"
				alignItems="center"
			>
				<Grid container
					direction="row"
					justify="space-between"
					alignItems="center"
				>
					<Grid container
						xs={3}
						direction="column"
						justify="space-between"
						alignItems="flex-start"
						spacing={5}
					>
						<Grid item xs={4}><Seat /></Grid>
						<Grid item xs={4}><Seat /></Grid>
					</Grid>
					<Grid container
						xs={5}
						direction="row"
						justify="center"
						alignItems="center"
					>
						<Grid item xs={10}>
							<div style={textContainerStyle}>{`publicCards`}</div>
						</Grid>
						<Grid item xs={4}>
							<div style={textContainerStyle}>{`pool: ${pool}`}</div>
						</Grid>
						<Grid item xs={4}>
							<div style={textContainerStyle}>{`bet: ${bet}`}</div>
						</Grid>
					</Grid>
					<Grid container
						xs={3}
						direction="column"
						justify="space-between"
						alignItems="center"
						spacing={5}
					>
						<Grid item xs={4}><Seat /></Grid>
						<Grid item xs={4}><Seat /></Grid>
					</Grid>
				</Grid>
				<Grid container item
					xs={8}
					direction="row"
					justify="space-around"
					alignItems="flex-end"
				>
					<Grid item><Seat /></Grid>
					<Grid item><Seat /></Grid>
					<Grid item><Seat /></Grid>
				</Grid>
			</Grid>
		</div>
	)
}