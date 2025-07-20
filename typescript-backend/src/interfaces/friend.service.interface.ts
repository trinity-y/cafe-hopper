import { CreateFriendDTO, IFriend } from './friend.interface';
import { IUser } from './user.interface';

export interface IFriendServiceAPI {
  getUserFriendsByUserId(id: number): Promise<IUser[]>;
  getUserMutualsByUserId(id: number): Promise<IUser[]>;
  createFriend(friend: CreateFriendDTO): Promise<IFriend | null>;
}
