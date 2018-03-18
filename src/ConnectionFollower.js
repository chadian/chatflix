import React, { Component } from 'react';
import emoji from "base64-emoji";
import styles from './ConnectionFollower';

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
    this.setState(prevState => {
      return { ...prevState, candidate };
    });
  }

  tryCandidate() {
    const { tinCan } = this.props;
    const { candidate } = this.state;

    tinCan.tryCandidate(
      JSON.parse(emoji.decode(candidate))
    );
  }

  sendMessage() {
    const { tinCan } = this.props;
    tinCan.sendMessage('hello world');
  }

  render() {
    const {
      pingOffer,
      pongOffer,
      candidate
    } = this.state;

    return <div className="ConnectionFollower">
      <textarea
        placeholder="Paste response here"
        className="pingOffer" value={ pingOffer }
        onChange={ e => this.updatePingOffer(e.target.value) }
      />
      <button onClick={ e => this.acceptPingOffer() }>Accept Response</button>

      { emoji.encode(pongOffer || '').toString() }

      <textarea
        placeholder="Paste candidate here"
        className="candidate" value={ candidate }
        onChange={ e => this.updateCandidate(e.target.value) }
      />
      <button onClick={ () => this.tryCandidate() }>Try candidate</button>
      <button onClick={ () => this.sendMessage( )}>Send Message</button>
    </div>;
  }
}
