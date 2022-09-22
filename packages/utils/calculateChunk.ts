/** 从消息的 `seq` 中计算它的 chunk
 * @param seq 消息的 `seq`
 */
const calculateChunk = (seq: number) => Math.floor(seq / 20);

/** 从消息的 `time` 中计算它的 chunk
 * @param time 消息的 `time`
 */
export const calculatePrivateChunk = (time: number) => Math.floor(time / 86400);

export default calculateChunk;
