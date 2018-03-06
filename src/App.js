import React, { Component } from 'react';
import TinCan from './TinCan';
import ConnectionSetup from './ConnectionSetup';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { messages: [] };
  }

  componentDidMount() {
    // const messageReceiver = person => message =>
    //   this.addMessage(person + message);

    // const me = new TinCan('Berlin', 'channel')
    //   .setCandidateReceiver(candidate => otherPerson.tryCandidate(candidate))
    //   .setMessageReceiver(messageReceiver('Sent from Dhaka: '));

    // const otherPerson = new TinCan('Dhaka', 'channel')
    //   .setCandidateReceiver(candidate => me.tryCandidate(candidate))
    //   .setMessageReceiver(messageReceiver('Sent from Berlin: '));

    // // const logAndReturn = thing => console.log(thing) || thing;
    // Promise.all([me.assemble(), otherPerson.assemble()])
    //   .then(me.ping)
    //   .then(otherPerson.pinged)
    //   .then(otherPerson.pong)
    //   .then(me.ponged)
    //   .then(() => setTimeout(me.sendMessage.bind(me, 'Hallo'), 3000))
    //   .then(() =>
    //     setTimeout(otherPerson.sendMessage.bind(otherPerson, 'হ্যালো'), 5000)
    //   );
  }

  // addMessage(message) {
  //   this.setState(({ messages }) => ({ messages: [ ...messages, message ] }));
  // }

  render() {
    return <div className="App">
        <h1 className="App-title">Chatflix</h1>
        <TinCan render={tinCan =>
          <ConnectionSetup tinCan={tinCan}/>
        }/>
      </div>;
  }
}

export default App;
