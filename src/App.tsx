import React from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const x = (a: number, b: number) => a * 2 + b
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Hello World {x(3, 5)}</div>
      </header>
    </div>
  )
}

export default App
