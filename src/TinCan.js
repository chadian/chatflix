import React, { Component } from "react";

export default class extends Component {
  constructor() {
    super();
    this.state = new TinCan();
  }

  render() {
    return this.props.render(this.state)
  }
}

class TinCan {
  alias = Math.random().toString();
  channelName = '';
  candidateReceiver = () => {};
  messageReceiver = () => {};

  sentDescriptions = [];
  receivedDescriptions = [];

  constructor(alias, channelName = 'default') {
    this.alias = alias;
    this.channelName = channelName;
  }

  assemble = () => {
    const connection = new RTCPeerConnection();
    this.setupConnection(connection);

    const channel = connection.createDataChannel(this.channelName);

    this.connection = connection;
    this.channel = channel;

    return Promise.resolve(this);
  };

  setupConnection(connection) {
    const messageReceiver = this.messageReceiver;

    connection.ondatachannel = e => {
      e.channel.onmessage = messageEvent => messageReceiver(messageEvent.data);
    };

    connection.onicecandidate = e => this.candidateReceiver(e.candidate);
  }

  setCandidateReceiver = receiver => {
    if (typeof receiver !== 'function')
      throw TypeError('Receiver should be a function');
    this.candidateReceiver = receiver;

    return this;
  };

  tryCandidate = ice => {
    if (!ice) return;
    this.connection.addIceCandidate(ice);
    return this;
  };

  setMessageReceiver = receiver => {
    if (typeof receiver !== 'function') {
      throw TypeError('Receiver should be a function');
    }

    this.messageReceiver = receiver;

    return this;
  };

  sendMessage = (msg = '') => {
    this.channel.send(msg);
    return this;
  };

  ping = async () => {
    const desc = await this.connection.createOffer();
    this.connection.setLocalDescription(desc);
    this.sentDescriptions.push(desc);

    return desc;
  };

  pinged = async ping => {
    this.receivedDescriptions.push(ping.offer);
    this.connection.setRemoteDescription(ping.offer);
    this.tryCandidate(ping.candidate);

    return this;
  };

  pong = async () => {
    const desc = await this.connection.createAnswer();
    this.connection.setLocalDescription(desc);

    return desc;
  };

  ponged = async pong => {
    this.sentDescriptions.push(pong.offer);
    this.connection.setRemoteDescription(pong.offer);

    return this;
  };
}