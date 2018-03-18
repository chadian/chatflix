import React, { Component } from "react";
import emoji from 'base64-emoji';
import styles from './ConnectionLeader.css';

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
    const { pongOffer } = this.state;
    const { tinCan } = this.props;
    tinCan.ponged(pongOffer);
  }

  updatePongOffer(pongOffer) {
    // remove whitespace
    pongOffer = pongOffer.replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    this.setState(prevState => {
      return { ...prevState, pongOffer };
    });
  }

  acceptPongOffer() {
    const { pongOffer } = this.state;
    const { tinCan } = this.props;

    tinCan.ponged(emoji.decode(pongOffer).toString())
  }

  render() {
    const {
      pingOffer,
      pongOffer,
      candidate
    } = this.state;

    return <div className="ConnectionLeader">
      { emoji.encode(pingOffer || '').toString() }
      <textarea
        placeholder="Paste response here"
        className="PongOffer"
        value={ pongOffer }
        onChange={ e => this.updatePongOffer(e.target.value) }
      ></textarea>
      <button onClick={ e => this.acceptPongOffer() }>Accept Response</button>

      { emoji.encode(JSON.stringify(candidate) || "").toString() }
    </div>
  }
}
