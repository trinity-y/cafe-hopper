export interface IUser {
  uid: number;
  username: string;
}

export type CreateUserDTO = Omit<IUser, 'uid'>;