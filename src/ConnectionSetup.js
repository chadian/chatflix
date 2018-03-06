import React, { Component } from "react";

export default class ConnectionSetup extends Component {
  constructor() {
    super();
    this.state = {};
  }

  assembleTinCan() {
    const { tinCan, messageHandler } = this.props;
    tinCan
      .setCandidateReceiver(() => {})
      .setMessageReceiver(messageHandler || (() => {}))
      .assemble()
      .then(tinCan.ping)
      .then(generatedCandidate => {
        this.setState((prevState) => {
          return { ...prevState, generatedCandidate };
        });
      });
  }

  tryCandidate() {
    console.log('will try ', this.state.proposedCandidate);
  }

  updateProposedCandidate(e) {
    const candidateValue = e.target.value;
    this.setState(prevState => {
      return { ...prevState, proposedCandidate: candidateValue };
    });
  }

  render() {
    const { generatedCandidate } = this.state;
    const shouldDisableGenerate = typeof generatedCandidate === 'string';

    return <div className="connection-setup">
      {
        generatedCandidate ? (
          [
            <div>Copy Me</div>,
            <div><code>{ generatedCandidate }</code></div>
          ]
        ) : (
          <button onClick={ () => this.assembleTinCan() }>
            Generate Candidate
          </button>
        )
      }

      or

      <textarea onChange={ (e) => this.updateProposedCandidate(e) }/>
      <button onClick={ () => this.tryCandidate() }>Try Candidate</button>
    </div>
  }
}
