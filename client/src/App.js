import React from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import Table from './container/Table/table'


function App() {

  const testSocket = () => {
    const socket = io.connect();
    console.log('ppp')
  }

  return (
    <div>
      <h1>POKER</h1>
      <Table />
      <button onClick={testSocket}>connect</button>
    </div>
  );
}

export default App;
