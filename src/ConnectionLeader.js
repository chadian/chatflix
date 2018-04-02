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

  packPing(pingOffer, candidate) {
    return packer({ offer: pingOffer, candidate });
  }

  onCopy() {
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

    const onCopy = this.onCopy.bind(this);
    const emojiPing = this.packPing(pingOffer, candidate);

    return <div className="ConnectionLeader">
      { pingOffer && candidate ?
        [
          <div className="StepOption"><h2>1. create ping</h2></div>,
          <em>The emoji ping has been created.</em>,
          <Copy onCopy={ onCopy } copyText={ emojiPing } render={(copyAction => {
            return <button className="Button" onClick={copyAction}>
              copy emoji ping 🔠
            </button>;
          })}/>,
          isPingCopied ? <em>Now send this emoji ping to the other netflixer</em> : null
        ] : 'Loading...'
      }

      { isPingCopied ? (
          <Fragment>
            <div className="StepOption"><h2>2. accept pong</h2></div>
              <span>
                Once the other netflixer has accepted your emoji ping, they will send
                back a pong which you'll paste in the below.
              </span>
              <textarea
                placeholder="Paste pong here"
                className="OfferTextarea"
                value={ pong }
                onChange={ e => this.updatePong(e.target.value) }
              ></textarea>

              <button className="Button" onClick={ e => this.acceptPong() }>Accept pong</button>
          </Fragment>
        ) : null
      }
    </div>
  }
}
