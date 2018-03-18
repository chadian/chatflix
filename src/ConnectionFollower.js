import React, { Component } from 'react';
import emoji from "base64-emoji";
import { Button } from './ConnectionFollower';

export default class ConnectionFollower extends Component {
  constructor() {
    super();
    this.state = {
      pingOffer: null,
      pongOffer: null,
    };
  }

  updatePingOffer(pingOffer) {
    // remove whitespace
    pingOffer = pingOffer.replace(/^\s+|\s+$|\s+(?=\s)/g, '')

    this.setState(prevState => {
      return { ...prevState, pingOffer };
    });
  }

  acceptPingOffer() {
    const { tinCan } = this.props;
    const { pingOffer } = this.state;

    tinCan
      .pinged(emoji.decode(pingOffer).toString())
      .then(() => tinCan.pong())
      .then(pongOffer => {
        this.setState(prevState => {
          return { ...prevState, pongOffer };
        });
      });
  }

  updateCandidate(candidate) {
    // removes whitespace
    candidate = candidate.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    this.setState(prevState => {
      return { ...prevState, candidate };
    });
  }

  tryCandidate() {
    const { tinCan } = this.props;
    const { candidate } = this.state;

    tinCan.tryCandidate(
      JSON.parse(emoji.decode(candidate).toString())
    );
  }

  render() {
    const {
      pingOffer,
      pongOffer,
      candidate
    } = this.state;

    return <div className="ConnectionFollower">
      {
        !pongOffer && [
          <textarea
            placeholder="Paste ping here"
            className="OfferTextarea" value={ pingOffer }
            onChange={ e => this.updatePingOffer(e.target.value) }
          />,
          <button
            className="Button"
            onClick={ e => this.acceptPingOffer() }
          >
            accept ping
          </button>
        ]
      }

      {
        pongOffer && [
          <span>Perfect, now send the emoji pong <em>below</em> back.</span>,
          <h2>Pong</h2>,
          <div className="EmojiBlock">
            { emoji.encode(pongOffer || '').toString() }
          </div>
        ]
      }

      {
        pongOffer && [
          <textarea
            placeholder="Paste candidate here"
            className="OfferTextarea" value={ candidate }
            onChange={ e => this.updateCandidate(e.target.value) }
          />
        ,
          <button className="Button" onClick={ () => this.tryCandidate() }>Try candidate</button>
        ]
      }
    </div>;
  }
}
