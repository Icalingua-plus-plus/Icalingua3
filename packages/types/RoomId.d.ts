export type RoomType = 'group' | 'discuss' | 'private';

type RoomId = `${RoomType}-${string}`;

export default RoomId;
