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
      <h1 className="AppTitle">Chatflix</h1>
      <TinCan render={ tinCan =>
        [
          <ConnectionSetup
            tinCan={ tinCan }
            messageHandler={ msg => console.log(Date(), msg) }
          />,
          <button onClick={ () => tinCan.sendMessage('hello') }>Say Hello</button>
        ]
      }/>
    </div>;
  }
}

export default App;
