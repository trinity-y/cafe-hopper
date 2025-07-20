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

  async searchUsers(username: string, current_uid: number): Promise<IUser[]> {
    const query = `
      SELECT id, username, firebase_uid
      FROM "User"
      WHERE username ILIKE $1
        AND id != $2
      LIMIT 10
    `;
    const matchedUsers = await userModel.rawQuery(query, [`%${username}%`, current_uid]);
    return matchedUsers;
  }
};

export default userService;
