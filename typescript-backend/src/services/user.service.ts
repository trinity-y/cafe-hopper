import prisma from '../prisma/prisma.service';
import { IUser } from '../interfaces/user.interface';
import { IUserServiceAPI } from '../interfaces/user.service.interface'; 

const userService: IUserServiceAPI = {
  async getAllUsers(): Promise<IUser[]> {
    return prisma.user.findMany();
  },

  async getUserById(id: number): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};

export default userService;
