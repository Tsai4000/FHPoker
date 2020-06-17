import React, { useState, useCallback } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Card from '../Card/card'
import StatusUI from './component/statusui'
import NameUI from './component/nameui'
import MoneyUI from './component/moneyui'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: 200,
		height: 150,
		position: "relative"
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
	}
}))

export default function Seat(props) {
	const classes = useStyles()

	const [status, setStatus] = useState('empty')

	return (
		<div className={classes.root}>
			<Grid container spacing={0} justify="space-between">
				<Card number={props.player && props.player.hand[0]} left={0}></Card>
				<Card number={props.player && props.player.hand[1]} left={60}></Card>
				<NameUI name={props.player && props.player.name}></NameUI>
				<MoneyUI money={props.player && props.player.money}></MoneyUI>
				<StatusUI player={props.player} id={props.id} socket={props.socket}></StatusUI>
			</Grid>
		</div>
	)
}
