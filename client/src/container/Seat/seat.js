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

	const [card1, setCard1] = useState(0)
	const [card2, setCard2] = useState(0)
	const [name, setName] = useState('default')
	const [money, setMoney] = useState(0)
	const [status, setStatus] = useState('default')

	const tryClick = useCallback(() => {
		setCard1(card1 + 1)
		setCard2(card2 + 1)
	}, [card1, card2, setCard1, setCard2])

	return (
		<div className={classes.root}>
			<Grid container spacing={0} justify="space-between">
				<Card number={card1} left={0}></Card>
				<Card number={card2} left={60}></Card>
				<NameUI name={name}></NameUI>
				<MoneyUI money={money}></MoneyUI>
				<StatusUI status={status}></StatusUI>
			</Grid>
		</div>
	)
}
