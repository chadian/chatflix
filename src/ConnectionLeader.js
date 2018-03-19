import React, { Component } from "react";
import {
  pingPacker as packer,
  pongUnpacker as unpacker
} from "./packaging";
import emoji from "base64-emoji";
import { Button } from './ConnectionStyles.css';

export default class ConnectionLeader extends Component {
  constructor(props) {
    super();

    const { tinCan, onSetupFinished } = props;

    this.state = {
      pingOffer: null,
      pongOffer: null,
      candidate: null,
    };

    tinCan.setCandidateReceiver(this.receiveCandidate.bind(this));
    onSetupFinished();
    tinCan.connection.oniceconnectionstatechange = e => console.log(e.target.iceConnectionState);
  }

  componentDidMount() {
    this.generatePingOffer();
  }

  receiveCandidate(candidate) {
    if (!candidate) return;

    this.setState(prevState => {
      return { ...prevState, candidate };
    });
  }

  generatePingOffer() {
    const { tinCan } = this.props;

    tinCan.ping()
      .then(pingOffer => {
        this.setState((prevState) => {
          return { ...prevState, pingOffer };
        });
      });
  }

  ponged() {
    const { pong } = this.state;
    const { tinCan } = this.props;
    tinCan.ponged(unpacker(pong));
  }

  updatePong(pong) {
    // remove whitespace
    pong = pong.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    this.setState(prevState => {
      return { ...prevState, pong };
    });
  }

  acceptPong() {
    const { pong } = this.state;
    const { tinCan } = this.props;

    tinCan.ponged(unpacker(pong));
  }

  render() {
    const {
      pingOffer,
      pong,
      candidate,
    } = this.state;

    return <div className="ConnectionLeader">
      { pingOffer && candidate ? [
          <h2>Ping</h2>,
          <span>We've created an emoji ping below, copy it, and send it the other chatflixer.</span>,
          <div className="EmojiBlock">
            { packer({ offer: pingOffer, candidate }) }
          </div>
        ] : 'Loading...'
      }

      <textarea
        placeholder="Paste pong here"
        className="OfferTextarea"
        value={ pong }
        onChange={ e => this.updatePong(e.target.value) }
      ></textarea>

      <button className="Button" onClick={ e => this.acceptPong() }>Accept pong</button>
    </div>
  }
}
