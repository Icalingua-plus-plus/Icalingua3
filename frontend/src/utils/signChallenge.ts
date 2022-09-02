const signChallenge = async (challenge: string, key: string) => {
  const textEncoder = new TextEncoder();
  const jwk = JSON.parse(key) as JsonWebKey;
  console.log(jwk);
  
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-521' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-512' } },
    privateKey,
    textEncoder.encode(challenge),
  );
  return new Uint8Array(signature);
};

export default signChallenge;
