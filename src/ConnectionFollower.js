import React, { Fragment, Component } from 'react';
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
      isPongCopied: false,
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

  onPongCopy() {
    this.setState((prevState) => {
      return { ...prevState, isPongCopied: true };
    });
  }

  render() {
    const {
      ping,
      pongOffer,
      isPongCopied
    } = this.state;

    const onCopy = this.onPongCopy.bind(this);

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
        pongOffer &&
        <Fragment>
          <span>Perfect, now send the emoji pong <em>below</em> back.</span>
          <h2>Pong</h2>
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
        </Fragment>
      }
    </div>;
  }
}
