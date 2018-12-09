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

export class TinCan {
  channelName = '';

  sentDescriptions = [];
  receivedDescriptions = [];

  constructor(channelName = 'default') {
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
    // setup channel
    connection.ondatachannel = e => this.setupChannel(e.channel);

    // setup ice candidate handling
    connection.onicecandidate = e => this.candidateReceiver(e.candidate);

    connection.onconnectionstatechange = () => this.checkConnectionEstablished();
  }

  setupChannel(channel) {
    const messageReceiver = this.messageReceiver;
    channel.onmessage = messageEvent => messageReceiver(messageEvent.data);
    channel.onopen = () => this.checkConnectionEstablished();
    channel.onclose = () => this.checkConnectionEstablished();
  }

  checkConnectionEstablished() {
    const isChannelReady = this.channel.readyState === 'open';

    // TODO: Clarify between which of these states are necessary
    const isConnectionReady = this.connection.connectionState === 'connected'
    || this.connection.iceConnectionState === 'completed'
    || this.connection.iceConnectionState === 'connected';

    if (isConnectionReady && isChannelReady) {
      this.onConnectionEstablished();
    }
  }

  setOnConnectionEstablished(handler) {
    this.onConnectionEstablished = handler;

    return this;
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
    await this.connection.setRemoteDescription(pong.offer);

    return this;
  };
}
