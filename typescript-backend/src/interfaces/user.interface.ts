export interface IUser {
  id: number;
  username: string;
  firebase_uid: string;
}

export type CreateUserDTO = Omit<IUser, 'id'>;