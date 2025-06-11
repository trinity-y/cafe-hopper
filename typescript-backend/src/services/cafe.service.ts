import { CustomModel } from '../../orm/custom';
import { ICafe } from '../interfaces/cafe.interface';
import { ICafeServiceAPI } from '../interfaces/cafe.service.interface'; 

// Just having this here for now but maybe better to have this as ENUM
const cafeModel = new CustomModel('Cafe');

const cafeService: ICafeServiceAPI = {
  async getAllCafes(): Promise<ICafe[]> {
    return cafeModel.findMany(); // Maybe a better way to do this?
  },

  async getCafeById(id: number): Promise<ICafe | null> {
    return cafeModel.findUnique(id); 
  },
};

export default cafeService;
