export interface IFriend {
  id: number;
  user_id: number;
  friend_id: number;
}

export type CreateUserDTO = Omit<IFriend, 'id'>;