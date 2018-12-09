import { TinCan } from './TinCan';

let mockRTCDataChannelProto = {
  onmessage: null,
  onopen: null,
  onclose: null,
  readyState: "connecting"
};

let mockRTCPeerConnectionProto = {
  ondatachannel: null,
  createDataChannel: jest.fn(() => {
    Object.create(mockRTCDataChannelProto);
  }),
};

it("uses a default channelName if none are specified", () => {
  let tinCan = new TinCan();
  expect(tinCan.channelName).toBe('default');
});

it("uses channelName via constructor", () => {
  let tinCan = new TinCan("my-channel");
  expect(tinCan.channelName).toBe("my-channel");
});


describe("assemble", () => {
  let mockRTCPeerConnection;

  beforeEach(() => {
    mockRTCPeerConnection = global.RTCPeerConnection = jest.fn();
    mockRTCPeerConnection.prototype = mockRTCPeerConnectionProto;
  });

  it("sets up a new RTCPeerConnection", () => {
    let tinCan = new TinCan();
    let setupConnectionSpy = jest.spyOn(tinCan, "setupConnection");
    tinCan.assemble();

    // called with `new` to create a new instance
    expect(mockRTCPeerConnection).toHaveBeenCalledTimes(1);

    // connection instance is passed to `setupConnection`
    expect(setupConnectionSpy).toHaveBeenCalledWith(mockRTCPeerConnection.mock.instances[0]);
  });
});

describe("setupConnection sets up connection event callbacks", () => {
  let tinCan;
  let connection;

  beforeEach(() => {
    tinCan = new TinCan();
    connection = Object.create(mockRTCPeerConnectionProto);

    // some state setup
    tinCan.connection = connection;
    tinCan.channel = { readyState: "open" };

    tinCan.setupConnection(connection);
  });

  it("has setup ondatachannel", () => {
    let setupChannelSpy = jest.spyOn(tinCan, "setupChannel");

    let mockEvent = new Event("RTCDataChannelEvent");
    mockEvent.channel = Object.create(mockRTCDataChannelProto);
    connection.ondatachannel(mockEvent);

    expect(setupChannelSpy).toHaveBeenCalledWith(mockEvent.channel);
  });

  it("has setup onicecandidate", () => {
    let mockCandidateReceiver = jest.fn();
    tinCan.setCandidateReceiver(mockCandidateReceiver);

    let mockEvent = new Event("RTCPeerConnectionIceEvent");
    mockEvent.candidate = {};

    connection.onicecandidate(mockEvent);
    expect(mockCandidateReceiver).toHaveBeenCalledWith(mockEvent.candidate);
  });

  it("has setup onconnectionstatechange", () => {
    let checkConnectionEstablishedSpy = jest.spyOn(tinCan, "checkConnectionEstablished");
    connection.onconnectionstatechange();
    expect(checkConnectionEstablishedSpy).toHaveBeenCalled();
  });
});

describe("setupChannel sets up connection event callbacks", () => {
  let tinCan;
  let channel;
  let messageReceiver;

  beforeEach(() => {
    tinCan = new TinCan();

    messageReceiver = jest.fn();
    tinCan.setMessageReceiver(messageReceiver);
    tinCan.connection = Object.create(mockRTCPeerConnectionProto);
    channel = tinCan.channel = Object.create(mockRTCDataChannelProto);
    tinCan.setupChannel(channel);
  });

  it("has setup onmessage", () => {
    let mockEvent = new Event("MessageEvent");
    mockEvent.data = "a b c";

    channel.onmessage(mockEvent);

    expect(messageReceiver).toHaveBeenCalledWith("a b c");
  });

  it("has setup onopen", () => {
    let checkConnectionEstablishedSpy = jest.spyOn(tinCan, "checkConnectionEstablished");
    channel.onopen();
    expect(checkConnectionEstablishedSpy).toHaveBeenCalled();
  });

  it("has setup onclose", () => {
    let checkConnectionEstablishedSpy = jest.spyOn(tinCan, "checkConnectionEstablished");
    channel.onclose();
    expect(checkConnectionEstablishedSpy).toHaveBeenCalled();
  });
});

describe("calls onConnectionEstablished when connection and channel are ready", () => {
  const CHANNEL_OPEN = 'open';
  const CONNECTION_CONNECTED = 'connected';
  const CONNECTION_ICE_CONNECTED = 'connected';
  const CONNECTION_ICE_COMPLETED = 'completed';

  let tinCan;
  let onConnectionEstablishedHandlerMock;

  beforeEach(() => {
    tinCan = new TinCan();
    onConnectionEstablishedHandlerMock = jest.fn();

    tinCan.setOnConnectionEstablished(onConnectionEstablishedHandlerMock);
  });

  it("has channel: open, connection: connected", () => {
    tinCan.connection = Object.create(mockRTCPeerConnectionProto);
    tinCan.channel = Object.create(mockRTCDataChannelProto);

    tinCan.channel.readyState = CHANNEL_OPEN;
    tinCan.connection.connectionState = CONNECTION_CONNECTED;

    tinCan.checkConnectionEstablished();
    expect(onConnectionEstablishedHandlerMock).toHaveBeenCalled();
  });

  it("has channel: open, ice connection: connected", () => {
    tinCan.connection = Object.create(mockRTCPeerConnectionProto);
    tinCan.channel = Object.create(mockRTCDataChannelProto);

    tinCan.channel.readyState = CHANNEL_OPEN;
    tinCan.connection.iceConnectionState = CONNECTION_ICE_CONNECTED;

    tinCan.checkConnectionEstablished();
    expect(onConnectionEstablishedHandlerMock).toHaveBeenCalled();
  });

  it("has channel: open, ice connection: completed", () => {
    tinCan.connection = Object.create(mockRTCPeerConnectionProto);
    tinCan.channel = Object.create(mockRTCDataChannelProto);

    tinCan.channel.readyState = CHANNEL_OPEN;
    tinCan.connection.iceConnectionState = CONNECTION_ICE_COMPLETED;

    tinCan.checkConnectionEstablished();
    expect(onConnectionEstablishedHandlerMock).toHaveBeenCalled();
  });
});
