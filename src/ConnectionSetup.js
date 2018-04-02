import React, { Component } from "react";
import classnames from 'classnames';
import styles from './ConnectionStyles.css';
import ConnectionLeader from './ConnectionLeader';
import ConnectionFollower from './ConnectionFollower';

export default class ConnectionSetup extends Component {
  constructor() {
    super();

    this.state = {
      role: null
    };
  }

  componentDidMount() {
    const { tinCan, messageHandler } = this.props;
    tinCan.setMessageReceiver(messageHandler || console.log);
  }

  assembleTinCan() {
    const { tinCan } = this.props;
    tinCan.assemble();
  }

  pinged() {
    const { pingedOffer } = this.state;
    const { tinCan } = this.props;
    tinCan.pinged(pingedOffer)
      .then(tinCan.pong)
      .then(pongedOffer => {
        this.setState((prevState) => {
          return { ...prevState, pongedOffer }
        });
      });
  }

  updatePingedOffer(e) {
    const offer = e.target.value;

    this.setState(prevState => {
      return { ...prevState, pingedOffer: offer };
    });
  }

  chooseRole(role) {
    this.setState((prevState) => {
      return {
        ...prevState, role
      };
    });
  }

  reset() {
    this.chooseRole(null);
  }

  render() {
    const {
      generatedOffer,
      pongedOffer,
      role
    } = this.state;

    const { tinCan } = this.props;

    const isRoleChosen = Boolean(role);

    return <div className="ConnectionSetup">
      <button className="EmojiButton Button Reset" onClick={() => this.reset()}>
        reset ⏮
      </button>

      {
        (!isRoleChosen) &&
        [
          <div className="StepOption"><h3>ping</h3></div>,
          <button
            className='EmojiButton Button'
            onClick={ () => this.chooseRole("LEADER") }
          >
            🗣 create ping
          </button>
        ]
      }

      {
        role === "LEADER" &&
          <ConnectionLeader
            tinCan={ tinCan }
            onSetupFinished={ () => this.assembleTinCan() }
          />
      }

      {
        role !== "LEADER" &&
        [
          <div className="StepOption"><h3>or be pinged</h3></div>,
          <ConnectionFollower
            tinCan={ tinCan }
            onSetupFinished={ () => this.assembleTinCan() }
          />
        ]
      }
    </div>;
  }
}
