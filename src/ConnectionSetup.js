import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './ConnectionStyles.css';
import ConnectionLeader from './ConnectionLeader';
import ConnectionFollower from './ConnectionFollower';
import {
  connectionSetupReducer,
  SET_ROLE_ACTION,
  RESET_ACTION
} from './state/connectionSetup';

class ConnectionSetup extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    const {
      tinCan,
      messageHandler,
      onConnectionEstablished,
    } = this.props;

    tinCan.setMessageReceiver(messageHandler || console.log);
    tinCan.setOnConnectionEstablished(onConnectionEstablished);
  }

  assembleTinCan() {
    const { tinCan } = this.props;
    return tinCan.assemble();
  }

  chooseRole(role) {
    const { dispatch } = this.props;
    dispatch({
      type: 'SET_ROLE_ACTION',
      role
    });
  }

  render() {
    const {
      tinCan,
      dispatch,
      role,
      candidate,
      pingOffer,
      pong,
      wasPingCopied,
    } = this.props;

    const isRoleChosen = Boolean(role);

    return <div className="ConnectionSetup">
      <button className="EmojiButton Button Reset" onClick={() => dispatch({ type: RESET_ACTION })}>
        reset ⏮
      </button>

      {
        (!isRoleChosen) &&
        <Fragment>
          <div className="StepOption"><h3>ping</h3></div>
          <button
            className='EmojiButton Button'
            onClick={ () => this.chooseRole("LEADER") }
          >
            🗣 create ping
          </button>
        </Fragment>
      }

      {
        role === "LEADER" &&
          <ConnectionLeader
            tinCan={ tinCan }
            candidate={ candidate }
            pingOffer={ pingOffer }
            pong={ pong }
            wasPingCopied={ wasPingCopied }
            readyToAssemble={ () => this.assembleTinCan() }
          />
      }

      {
        role !== "LEADER" &&
        <Fragment>
          <div className="StepOption"><h3>or be pinged</h3></div>
          <ConnectionFollower
            tinCan={ tinCan }
            readyToAssemble={() => {
              return Promise.resolve(this.chooseRole("FOLLOWER"))
                .then(this.assembleTinCan())
            }}
          />
        </Fragment>
      }
    </div>;
  }
}


const mapStateToProps = (state) => {
  const {
    role,
    candidate,
    pingOffer,
    wasPingCopied,
  } = state.connectionSetup;

  return {
    role,
    candidate,
    pingOffer,
    wasPingCopied,
  };
};

export default connect(mapStateToProps)(ConnectionSetup);
