/** 从消息的 `seq` 中计算它的 chunk
 * @param seq 消息的 `seq`
 */
const calculateChunk = (seq: number) => Math.floor(seq / 20);

export default calculateChunk;
