import { CreateUserDTO, IUser } from './user.interface';

export interface IUserServiceAPI {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: number): Promise<IUser | null>;
  getUserByFirebaseId(firebase_uid: string): Promise<IUser | null>;
  createUser(user: CreateUserDTO): Promise<IUser | null>;
  doesEmailExist(email: string): Promise<boolean>;
  doesUsernameExist(username: string): Promise<boolean>;
  getUserByFirebaseUid(firebaseUid: string): Promise<IUser | null>;
}
