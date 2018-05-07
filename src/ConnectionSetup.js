import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './ConnectionStyles.css';
import ConnectionLeader from './ConnectionLeader';
import ConnectionFollower from './ConnectionFollower';
import {
  connectionSetupReducer,
  SET_ROLE_ACTION,
  RESET
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
    tinCan.assemble();
  }

  chooseRole(role) {
    const { dispatch } = this.props;
    dispatch({
      type: 'SET_ROLE_ACTION',
      role
    });
  }

  render() {
    const { tinCan, dispatch, role } = this.props;

    const isRoleChosen = Boolean(role);

    return <div className="ConnectionSetup">
      <button className="EmojiButton Button Reset" onClick={() => dispatch({ type: RESET })}>
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
            onSetupFinished={ () => this.assembleTinCan() }
          />
      }

      {
        role !== "LEADER" &&
        [
          <div className="StepOption"><h3>or be pinged</h3></div>,
          <ConnectionFollower
            tinCan={ tinCan }
            onSetupFinished={ () => this.assembleTinCan() }
          />
        ]
      }
    </div>;
  }
}


const mapStateToProps = (state) => {
  return { role: state.connectionSetup.role };
};

export default connect(mapStateToProps)(ConnectionSetup);
