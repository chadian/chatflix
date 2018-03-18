import React, { Component } from "react";
import classnames from 'classnames';
import styles from './ConnectionStyles.css';
import ConnectionLeader from './ConnectionLeader';
import ConnectionFollower from './ConnectionFollower';

export default class ConnectionSetup extends Component {
  constructor() {
    super();
    this.state = {
      role: null
    };
  }

  componentDidMount() {
    const { tinCan, messageHandler } = this.props;
    tinCan.setMessageReceiver(messageHandler || console.log);
  }

  assembleTinCan() {
    const { tinCan } = this.props;
    tinCan.assemble();
  }

  pinged() {
    const { pingedOffer } = this.state;
    const { tinCan } = this.props;
    tinCan.pinged(pingedOffer)
      .then(tinCan.pong)
      .then(pongedOffer => {
        this.setState((prevState) => {
          return { ...prevState, pongedOffer }
        });
      });
  }

  updatePingedOffer(e) {
    const offer = e.target.value;

    this.setState(prevState => {
      return { ...prevState, pingedOffer: offer };
    });
  }

  chooseRole(role) {
    this.setState((prevState) => {
      return {
        ...prevState, role
      };
    });
  }

  reset() {
    this.chooseRole(null);
  }

  render() {
    const {
      generatedOffer,
      pongedOffer,
      role
    } = this.state;

    const { tinCan } = this.props;

    const isRoleChosen = Boolean(role);
    const emojiButtonClasses = classnames('EmojiButton', 'Button', { roleChosen: isRoleChosen });

    return <div className="ConnectionSetup">
      <button className="EmojiButton Button" onClick={() => this.reset()}>
        reset ⏮
      </button>

      {
        (role === "LEADER" || !isRoleChosen) &&
        <button className={emojiButtonClasses} onClick={() => this.chooseRole("LEADER")}>
          create ping 🤜
        </button>
      }

      {
        (role === "FOLLOWER" || !isRoleChosen) &&
        <button className={emojiButtonClasses} onClick={() => this.chooseRole("FOLLOWER")}>
          accept ping 🤜🤛
        </button>
      }

      {
        role === "LEADER" &&
          <ConnectionLeader
            tinCan={ tinCan }
            onSetupFinished={ () => this.assembleTinCan() }
          />
      }

      {
        role === "FOLLOWER" &&
        (this.assembleTinCan() ||
        <ConnectionFollower
          tinCan={ tinCan }
        />)
      }
    </div>;
  }
}
