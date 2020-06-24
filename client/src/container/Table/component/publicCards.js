import React, { useCallback, useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from '../../Card/card'

export default function PublicCards(props) {


  return (
    <div style={{ width: '100%', height: 90, position: 'relative', float: 'left' }}>
      <Card left={'5%'} number={props.cards[0] ? props.cards[0] : -1}></Card>
      <Card left={'25%'} number={props.cards[1] ? props.cards[1] : -1}></Card>
      <Card left={'45%'} number={props.cards[2] ? props.cards[2] : -1}></Card>
      <Card left={'65%'} number={props.cards[3] ? props.cards[3] : -1}></Card>
      <Card left={'85%'} number={props.cards[4] ? props.cards[4] : -1}></Card>
    </div>
  )
}