import { CustomModel } from '../../orm/custom';
import { IUser } from '../interfaces/user.interface';
import { IUserServiceAPI } from '../interfaces/user.service.interface'; 

const userModel = new CustomModel('User');

const userService: IUserServiceAPI = {
  async getAllUsers(): Promise<IUser[]> {
    // return prisma.user.findMany();
    return userModel.findMany();
  },

  async getUserById(id: number): Promise<IUser | null> {
    return userModel.findUnique(id);
  },
};

export default userService;
