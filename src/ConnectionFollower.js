import React, {
  Fragment,
  Component
} from 'react';
import { connect } from 'react-redux';
import emoji from "base64-emoji";
import {
  pongPacker as packer,
  pingUnpacker as unpacker
} from './packaging';
import Copy from "./Copy";
import { SET_PONG_OFFER_ACTION } from "./state/connectionSetup";

export class ConnectionFollower extends Component {
  constructor(props) {
    super();

    const { tinCan } = props;

    this.state = {
      ping: null,
      isPongCopied: false,
    };
  }

  updatePing(ping) {
    // remove whitespace
    ping = ping.replace(/^\s+|\s+$|\s+(?=\s)/g, '')

    this.setState(prevState => {
      return { ...prevState, ping };
    });
  }

  handleAcceptPing() {
    const { readyToAssemble } = this.props;
    const { ping } = this.state;

    if (!ping) return;

    readyToAssemble()
      .then(this._acceptPing());
  }

  _acceptPing() {
    const { tinCan, dispatch } = this.props;
    const { ping } = this.state;

    return tinCan
      .pinged(unpacker(ping))
      .then(() => tinCan.pong())
      .then(pongOffer => {
        dispatch({ type: SET_PONG_OFFER_ACTION, pongOffer });
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  onPongCopy() {
    this.setState((prevState) => {
      return { ...prevState, isPongCopied: true };
    });
  }

  render() {
    const {
      ping,
      isPongCopied
    } = this.state;

    const { pongOffer } = this.props;
    const onCopy = this.onPongCopy.bind(this);

    return <div className="ConnectionFollower">
      {
        !pongOffer ? (

          <Fragment>
            <textarea
              placeholder="Paste ping here"
              className="OfferTextarea"
              value={ ping || "" }
              onChange={ e => this.updatePing(e.target.value) }
            />
            <button
              className="Button"
              onClick={ e => this.handleAcceptPing() }
            >
              👂 accept ping
            </button>
          </Fragment>

        ) : (

          <Fragment>
            <span>Perfect, now send the emoji pong <em>below</em> back.</span>
            <Copy
              copyText={ packer({ offer: pongOffer }) }
              onCopy={ onCopy }
              render={copyAction => {
                return <button className="Button" onClick={ copyAction }>
                  copy emoji pong 🔠
                </button>;
              }}
            />
            { isPongCopied ? <em>emoji pong copied</em> : null }
            <span>
              Hang tight, when the other netflixer accepts your pong you shoudl be
              connected.
            </span>
          </Fragment>

        )
      }
    </div>;
  }
}

const mapStateToProps = (state) => {
  const { pongOffer } = state.connectionSetup;

  return { pongOffer };
};

export default connect(mapStateToProps)(ConnectionFollower);
