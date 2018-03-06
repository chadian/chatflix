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
  candidateReceiver = null;
  messageReceiver = null;

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
    if (typeof receiver !== 'function')
      throw TypeError('Receiver should be a function');
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

    return pack(desc);
  };

  pinged = async packagedDesc => {
    const desc = unpack(packagedDesc);
    this.receivedDescriptions.push(desc);
    this.connection.setRemoteDescription(desc);
  };

  pong = async () => {
    const desc = await this.connection.createAnswer();
    this.connection.setLocalDescription(desc);
    return pack(desc);
  };

  ponged = async packedDesc => {
    const desc = unpack(packedDesc);
    this.sentDescriptions.push(desc);
    this.connection.setRemoteDescription(desc);
  };
}

function pack(thing) {
  return JSON.stringify(thing, null, '');
}

function unpack(thing) {
  return JSON.parse(thing);
}
