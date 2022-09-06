/** 用私钥对服务器发来的内容进行签名
 * @param challenge 服务器发来的内容
 * @param key 私钥，以 JWT 字符串的形式保存
 */
const signChallenge = async (challenge: string, key: string) => {
  const textEncoder = new TextEncoder();
  const jwk = JSON.parse(key) as JsonWebKey;
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
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
