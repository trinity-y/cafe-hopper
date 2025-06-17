export interface IUser {
  uid: number;
  username: string;
  firebase_uid: string;
}

export type CreateUserDTO = Omit<IUser, 'uid'>;