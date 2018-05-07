import React, { Fragment, Component } from 'react';
import TinCan from './TinCan';
import ConnectionSetup from "./ConnectionSetup";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      isConnectionEstablished: false,
    };
  }

  onConnectionEstablished() {
    this.setState(prevState => {
      return {
        ...prevState,
        isConnectionEstablished: true
      };
    });
  }

  render() {
    const { isConnectionEstablished } = this.state;

    return <div className="App">
      <h1 className="AppTitle">Chatflix</h1>
      <TinCan render={ tinCan =>
        <Fragment>
          <ConnectionSetup
            tinCan={ tinCan }
            messageHandler={ msg => console.log(Date(), msg) }
            onConnectionEstablished={ () => this.onConnectionEstablished() }
          />
          <button
            onClick={ () => tinCan.sendMessage('hello') }
            disabled={ !isConnectionEstablished }
          >
            Say Hello
          </button>
        </Fragment>
      }/>
    </div>;
  }
}

export default App;
