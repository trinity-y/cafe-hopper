import { CreateUserDTO, IUser } from './user.interface';

export interface IUserServiceAPI {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: number): Promise<IUser | null>;
  getUserByFirebaseId(firebase_uid: string): Promise<IUser | null>;
  createUser(user: CreateUserDTO): Promise<IUser | null>;
  doesEmailExist(email: string): Promise<boolean>;
  doesUsernameExist(username: string): Promise<boolean>;
  searchUsers(username: string, current_uid: number): Promise<IUser[]>;
}
