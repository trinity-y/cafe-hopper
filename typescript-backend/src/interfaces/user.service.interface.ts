import { IUser } from './user.interface';

export interface IUserServiceAPI {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: number): Promise<IUser | null>;
}
