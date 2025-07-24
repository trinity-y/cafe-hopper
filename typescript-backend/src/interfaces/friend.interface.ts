export interface IFriend {
  id: number;
  user_id: number;
  following_id: number;
}

export type CreateFriendDTO = Omit<IFriend, 'id'>;

