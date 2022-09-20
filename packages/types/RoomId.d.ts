export type RoomType = 'group' | 'discuss' | 'private';

export type RoomId = `${RoomType}-${string}`;
