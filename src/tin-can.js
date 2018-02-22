export default class TinCan {
  sentDescriptions = [];
  receivedDescriptions = [];
  dataChannels = [];

  constructor(channelName = Math.random().toString(), connection = new RTCPeerConnection()) {
    if (!connection instanceof RTCPeerConnection) {
      throw new TypeError('peerConnection must be an instance of RTCPeerConnection');
    }

    // channel must be created before any `createOffer` is
    // attempted on the RTCPeerConnection otherwise it will fail
    const channel = connection.createDataChannel(channelName, null);

    this.channel = channel;
    this.connection = connection;
  }

  async ping() {
    const desc = await this.connection.createOffer();
    this.connection.setLocalDescription(desc);
    this.sentDescriptions.push(desc);

    return packageDescription(desc);
  }

  async pinged(packagedDesc) {
    const desc = unpackageDescription(packagedDesc);
    this.receivedDescriptions.push(desc);
    this.connection.setRemoteDescription(desc);
  }

  async pong() {
    const desc = await this.connection.createAnswer();
    return packageDescription(desc);
  }

  async ponged(packagedDesc) {
    const desc = unpackageDescription(packagedDesc);
  }
}

function packageDescription(dsec) {
  return JSON.stringify(dsec, null, '');
}

function unpackageDescription(packagedDesc) {
  return JSON.parse(packagedDesc);
}
