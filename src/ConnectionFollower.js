import React, { Component } from 'react';
import emoji from "base64-emoji";
import {
  pongPacker as packer,
  pingUnpacker as unpacker
} from './packaging';
import Copy from "./Copy";

export default class ConnectionFollower extends Component {
  constructor(props) {
    super();

    const { tinCan } = props;

    this.state = {
      ping: null,
      pongOffer: null,
    };

    window.tinCan = tinCan;
  }

  updatePing(ping) {
    // remove whitespace
    ping = ping.replace(/^\s+|\s+$|\s+(?=\s)/g, '')

    this.setState(prevState => {
      return { ...prevState, ping };
    });
  }

  acceptPing() {
    const { tinCan, onSetupFinished } = this.props;
    const { ping } = this.state;

    onSetupFinished();

    tinCan
      .pinged(unpacker(ping))
      .then(() => tinCan.pong())
      .then(pongOffer => {
        this.setState(prevState => {
          return { ...prevState, pongOffer };
        });
      });
  }

  render() {
    const {
      ping,
      pongOffer
    } = this.state;

    return <div className="ConnectionFollower">
      {
        !pongOffer && [
          <textarea
            placeholder="Paste ping here"
            className="OfferTextarea" value={ ping }
            onChange={ e => this.updatePing(e.target.value) }
          />,
          <button
            className="Button"
            onClick={ e => this.acceptPing() }
          >
            👂 accept ping
          </button>
        ]
      }

      {
        pongOffer && [
          <span>Perfect, now send the emoji pong <em>below</em> back.</span>,
          <h2>Pong</h2>,
          <div className="EmojiBlock">
            { packer({ offer: pongOffer }) }
          </div>
        ]
      }
    </div>;
  }
}
