import React, { Component } from "react";

export default class ConnectionSetup extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.assembleTinCan();
  }

  assembleTinCan() {
    const { tinCan, messageHandler } = this.props;
    tinCan
      .setCandidateReceiver(candidate => this.receivedCandidate(candidate))
      .setMessageReceiver(messageHandler || console.log)
      .assemble();
  }

  receivedCandidate(candidate) {
    if (!candidate) return;

    this.setState(prevState => {
      console.log(candidate, 'candidate received');
      return { ...prevState, receivedCandidate: candidate };
    });
  }

  tryCandidate() {
    const { tinCan } = this.props;
    const { proposedCandidate } = this.state;

    tinCan.tryCandidate(proposedCandidate);
  }

  ping() {
    const { tinCan } = this.props;
    tinCan.ping()
      .then(generatedOffer => {
        this.setState((prevState) => {
          return { ...prevState, generatedOffer };
        });
      });
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

  ponged() {
    const { pongedOffer } = this.state;
    const { tinCan } = this.props;
    tinCan.ponged(pongedOffer).then(() => console.log(tinCan));
  }

  updatePingedOffer(e) {
    const offer = e.target.value;

    this.setState(prevState => {
      return { ...prevState, pingedOffer: offer };
    });
  }

  updatePongedOffer(e) {
    const offer = e.target.value;

    this.setState(prevState => {
      return { ...prevState, pongedOffer: offer };
    });
  }

  updateCandidate(e) {
    const candidate = JSON.parse(e.target.value);

    this.setState(prevState => {
      return { ...prevState, proposedCandidate: candidate }
    });
  }

  render() {
    const {
      generatedOffer,
      receivedCandidate,
      pongedOffer
    } = this.state;
    const shouldDisableGenerate = typeof generatedOffer === 'string';

    return <div className="connection-setup">
      <div>
        {generatedOffer ? [<div>Copy Me</div>, <div>
              <code>{generatedOffer}</code>
            </div>] : <button onClick={() => this.ping()}>Ping</button>}
        or
        <textarea onChange={e => this.updatePingedOffer(e)} />
        <button onClick={() => this.pinged()}>Pinged</button>
        <br />
        <br />
        <br />
        Ponged offer
        {pongedOffer}
        <br />
        <br />
        <textarea onChange={ e => this.updatePongedOffer(e) } />
        <br />
        <br />
        <button onClick={ () => this.ponged() }>Ponged</button>
      </div>
      <div>
        Received candidate
        {JSON.stringify(receivedCandidate)}
        <br />
        <textarea onChange={ e => this.updateCandidate(e) }/>
        <button onClick={ () => this.tryCandidate() }>Try Candidate</button>
      </div>
    </div>;
  }
}
