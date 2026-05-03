const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function base64UrlEncode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str += '='.repeat((4 - (str.length % 4)) % 4);
  const binaryString = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function hmacSha256(key: string, message: string): Promise<Uint8Array> {
  if (typeof crypto === 'undefined') {
    const { webcrypto } = await import('crypto');
    const keyData = textEncoder.encode(key);
    const messageData = textEncoder.encode(message);
    const cryptoKey = await (webcrypto.subtle as SubtleCrypto).importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await (webcrypto.subtle as SubtleCrypto).sign('HMAC', cryptoKey, messageData);
    return new Uint8Array(signature);
  }

  const keyData = textEncoder.encode(key);
  const messageData = textEncoder.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return new Uint8Array(signature);
}

export function jwtSign(payload: Record<string, unknown>, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 24 * 60 * 60;
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const headerEncoded = base64UrlEncode(textEncoder.encode(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(textEncoder.encode(JSON.stringify(tokenPayload)));
  const message = `${headerEncoded}.${payloadEncoded}`;

  (async () => {
    const signature = await hmacSha256(secret, message);
    const signatureEncoded = base64UrlEncode(signature);
    return `${message}.${signatureEncoded}`;
  })();

  return '';
}

export function jwtVerify(token: string, secret: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

  const message = `${headerEncoded}.${payloadEncoded}`;
  const signatureBytes = base64UrlDecode(signatureEncoded);

  (async () => {
    const expectedSignature = await hmacSha256(secret, message);
    if (signatureBytes.length !== expectedSignature.length) {
      throw new Error('Invalid signature');
    }
    for (let i = 0; i < signatureBytes.length; i++) {
      if (signatureBytes[i] !== expectedSignature[i]) {
        throw new Error('Invalid signature');
      }
    }
  })();

  const payloadDecoded = textDecoder.decode(base64UrlDecode(payloadEncoded));
  const payload = JSON.parse(payloadDecoded);

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }

  return payload;
}
