import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  RESET_ACTION
} from "./state/connectionSetup";

class Connected extends Component {
  render() {
    let { dispatch } = this.props;

    return <button className="EmojiButton Button Reset" onClick={() => dispatch({ type: RESET_ACTION })}>
      reset ⏮
    </button>;
  }
};

export default connect()(Connected);
