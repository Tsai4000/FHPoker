import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Card from '../Card/card'
import StatusUI from './component/statusui'
import NameUI from './component/nameui'
import MoneyUI from './component/moneyui'
import { useDispatch, useSelector } from "react-redux";

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
	const { sitOn, selfCard } = useSelector((state) => ({
		sitOn: state.user.sitOn,
		selfCard: state.user.selfCard
	}))
	const { seats } = useSelector((state) => ({
		seats: state.seats.seats
	}))
	const [cards, setCards] = useState(
		props.id === sitOn && selfCard !== null
			? selfCard
			: props.player && props.player.hand)
	useEffect(() => {
		setCards(
			props.id === sitOn && selfCard !== null
				? selfCard
				: props.player && props.player.hand)
	}, [seats])
	return (
		<div className={classes.root}>
			<Grid container spacing={0} justify="space-between">
				<Card number={cards && cards[0]} left={0}></Card>
				<Card number={cards && cards[1]} left={60}></Card>
				<NameUI name={props.player && props.player.name}></NameUI>
				<MoneyUI money={props.player && props.player.money}></MoneyUI>
				<StatusUI player={props.player} id={props.id} socket={props.socket}></StatusUI>
			</Grid>
		</div>
	)
}
