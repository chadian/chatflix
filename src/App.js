import React, { Fragment, Component } from 'react';
import TinCan from './TinCan';
import { connect } from "react-redux";
import Connected from './Connected';
import ConnectionSetup from "./ConnectionSetup";
import { CONNECTION_ESTABLISHED_ACTION } from "./state/connectionSetup";
import './App.css';

class App extends Component {
  constructor() {
    super();
  }

  onConnectionEstablished() {
    let { dispatch } = this.props;
    dispatch({ type: CONNECTION_ESTABLISHED_ACTION });
  }

  render() {
    const { isConnectionEstablished } = this.props;

    return <div className="App">
      <h1 className="AppTitle">Chatflix</h1>
      <TinCan render={ tinCan =>
        isConnectionEstablished ? (
          <Connected tinCan={ tinCan }/>
        ) : (
          <ConnectionSetup
            tinCan={ tinCan }
            messageHandler={ msg => console.log(Date(), msg) }
            onConnectionEstablished={ () => this.onConnectionEstablished() }
          />
        )
      }/>
    </div>;
  }
}

const mapStateToProps = ({ isConnectionEstablished }) => ({ isConnectionEstablished });

export default connect(mapStateToProps)(App);
