import React, { Fragment, Component } from "react";
import emoji from "base64-emoji";
import classnames from "classnames";
import {
  pingPacker as packer,
  pongUnpacker as unpacker
} from "./packaging";
import Copy from './Copy';
import { Button } from './ConnectionStyles.css';

export default class ConnectionLeader extends Component {
  emojiBlockElement = null;

  constructor(props) {
    super();

    const { tinCan, onSetupFinished } = props;

    this.state = {
      pingOffer: null,
      pongOffer: null,
      candidate: null,
      isPingCopied: false,
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

  packPing(pingOffer, candidate) {
    return packer({ offer: pingOffer, candidate });
  }

  onPingCopy() {
    this.setState(prevState => {
      return { ...prevState, isPingCopied: true };
    });
  }

  render() {
    const {
      pingOffer,
      pong,
      candidate,
      isPingCopied,
    } = this.state;

    const onCopy = this.onPingCopy.bind(this);
    const emojiPing = this.packPing(pingOffer, candidate);

    return <div className="ConnectionLeader">
      { pingOffer && candidate ?
        <Fragment>
          <div className="StepOption"><h2>1. copy ping</h2></div>
          <Copy onCopy={ onCopy } copyText={ emojiPing } render={copyAction => {
            return <button className="Button" onClick={ copyAction }>
              copy emoji ping 🔠
            </button>;
          }}/>
          { isPingCopied ? <em>emoji ping copied</em> : null }
        </Fragment> : 'Loading...'
      }

      { isPingCopied ?
        (<Fragment>
          <div className="StepOption"><h2>2. send ping</h2></div>
          Paste the emoji ping in a message (it's already been copied) to the other chatflixer, by e-mail, facebook, SMS,
          however you like.

          <div className="StepOption"><h2>3. accept pong</h2></div>
          <span>
            Once the other netflixer has accepted your emoji ping, they will send
            back a pong which you can paste below.
          </span>
          <textarea
            placeholder="Paste pong here"
            className="OfferTextarea"
            value={ pong }
            onChange={ e => this.updatePong(e.target.value) }
          ></textarea>

          <button className="Button" onClick={ e => this.acceptPong() }>accept pong</button>
        </Fragment>)
        : null
      }
    </div>
  }
}
