import React from "react"
import logo from "./logo.svg"
import "./App.css"
import io from "socket.io-client"
import Table from "./container/Table/table"
import Login from './container/Login/login'

function App() {
  const testSocket = () => {
    const socket = io.connect()
    console.log("ppp")
  }

  return (
    <div>
      <h1>POKER</h1>
      <Table />
      <Login />
    </div>
  )
}

export default App
