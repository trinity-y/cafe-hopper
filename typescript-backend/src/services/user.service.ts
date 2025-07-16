import { CustomModel } from '../../orm/custom';
import { IUser, CreateUserDTO } from '../interfaces/user.interface';
import { IUserServiceAPI } from '../interfaces/user.service.interface'; 

import admin from '../firebase/firebase-admin'
const userModel = new CustomModel('User');

const userService: IUserServiceAPI = {
  async getAllUsers(): Promise<IUser[]> {
    return userModel.findMany();
  },

  async getUserById(id: number): Promise<IUser | null> {
    return userModel.findUnique(id);
  },

  async getUserByFirebaseId(firebase_uid: string): Promise<IUser | null> {
    return userModel.findByColumn('firebase_uid', firebase_uid);
  },

  async createUser(user: CreateUserDTO): Promise<IUser | null> {
    return userModel.create(user);
  },

  async doesEmailExist(email: string): Promise<boolean> {
    try {
      if (await admin.auth().getUserByEmail(email)) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  async doesUsernameExist(username: string): Promise<boolean> {
    if ((await userModel.findMany({username})).length > 0) {
      return true;
    } else {
      return false;
    }
  },

  async getUserByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
    const users = await userModel.findMany({ firebase_uid: firebaseUid });
    return users.length > 0 ? users[0] : null;
  },
};

export default userService;
