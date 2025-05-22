import prisma from '../prisma/prisma.service';
import { ICafe } from '../interfaces/cafe.interface';
import { ICafeServiceAPI } from '../interfaces/cafe.service.interface'; 

const cafeService: ICafeServiceAPI = {
  async getAllCafes(): Promise<ICafe[]> {
    return prisma.cafe.findMany();
  },

  async getCafeById(id: number): Promise<ICafe | null> {
    return prisma.cafe.findUnique({
      where: { id },
    });
  },
};

export default cafeService;
