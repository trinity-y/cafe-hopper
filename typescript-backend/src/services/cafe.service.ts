import { CustomModel } from '../../orm/custom';
import { ICafe } from '../interfaces/cafe.interface';
import { ICafeServiceAPI } from '../interfaces/cafe.service.interface'; 

const cafeModel = new CustomModel('Cafe');

const cafeService: ICafeServiceAPI = {
  async getAllCafes(): Promise<ICafe[]> {
    return cafeModel.findMany();
  },

  async getCafeById(id: number): Promise<ICafe | null> {
    return cafeModel.findUnique(id); 
  },
};

export default cafeService;
