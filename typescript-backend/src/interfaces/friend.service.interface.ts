import { CreateFriendDTO, IFriend } from './friend.interface';

export interface IFriendServiceAPI {
  getUserFriendsByUserId(id: number): Promise<IFriend[] | null>;
  createFriend(friend: CreateFriendDTO): Promise<IFriend | null>;
}
