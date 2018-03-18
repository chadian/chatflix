import React, { Component } from 'react';
import TinCan from './TinCan';
import ConnectionSetup from './ConnectionSetup';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { messages: [] };
  }

  render() {
    return <div className="App">
      <h1 className="App-title">Chatflix</h1>
      <TinCan render={ tinCan =>
        <ConnectionSetup tinCan={ tinCan }/>
      }/>
    </div>;
  }
}

export default App;
