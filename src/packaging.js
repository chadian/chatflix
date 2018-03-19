import emoji from 'base64-emoji';

const emojify = obj => emoji.encode(JSON.stringify(obj)).toString();
const unemojify = emojis => JSON.parse(emoji.decode(emojis));

export function pingPacker(ping) {
  const { offer, candidate } = ping;
  if (typeof offer !== 'object') {
    throw new TypeError('`offer` key must be provided in ping');
  }

  if (typeof candidate !== 'object') {
    throw new TypeError('`candidate` key must be provided in ping');
  }

  return emojify(ping);
}

export function pingUnpacker(packedPing) {
  return unemojify(packedPing);
}

export function pongPacker(pong) {
  const { offer } = pong;
  if (typeof offer !== 'object') {
    throw new TypeError('`offer` key must be provided in ping');
  }

  return emojify(pong);
}

export function pongUnpacker(pong) {
  return unemojify(pong);
}
