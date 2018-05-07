import React, { Fragment, Component } from "react";
import emoji from "base64-emoji";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  pingPacker as packer,
  pongUnpacker as unpacker
} from "./packaging";
import Copy from './Copy';
import {
  SET_CANDIDATE_ACTION,
  SET_PING_OFFER_ACTION,
  SET_PING_WAS_COPIED_ACTION
} from './state/connectionSetup';
import { Button } from './ConnectionStyles.css';

export class ConnectionLeader extends Component {
  emojiBlockElement = null;

  constructor(props) {
    super();

    const {
      tinCan,
      readyToAssemble
    } = props;

    this.state = {
      pongOffer: null,
      isPingCopied: false,
    };

    tinCan.setCandidateReceiver(this.receiveCandidate.bind(this));
    readyToAssemble();
  }

  componentDidMount() {
    const { pingOffer } = this.props;

    if (!pingOffer) {
      this.generatePingOffer();
    }
  }

  receiveCandidate(candidate) {
    if (!candidate) return;
    const { dispatch } = this.props;

    dispatch({
      type: SET_CANDIDATE_ACTION,
      candidate
    });
  }

  generatePingOffer() {
    const {
      dispatch,
      tinCan
    } = this.props;

    tinCan.ping()
      .then(pingOffer => {
        dispatch({
          type: SET_PING_OFFER_ACTION,
          pingOffer
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
      const { dispatch } = this.props;
      dispatch({ type: SET_PING_WAS_COPIED_ACTION, value: true });
      return { ...prevState, isPingCopied: true };
    });
  }

  render() {
    const {
      pong,
      isPingCopied,
    } = this.state;

    const {
      candidate,
      pingOffer,
      wasPingCopied
    } = this.props;

    const onCopy = this.onPingCopy.bind(this);
    const emojiPing = pingOffer && candidate ? this.packPing(pingOffer, candidate) : null;

    return <div className="ConnectionLeader">
      { emojiPing ?
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

      { isPingCopied || wasPingCopied ?
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
            value={ pong || "" }
            onChange={ e => this.updatePong(e.target.value) }
          ></textarea>

          <button className="Button" onClick={ e => this.acceptPong() }>accept pong</button>
        </Fragment>)
        : null
      }
    </div>
  }
}

export default connect()(ConnectionLeader);
