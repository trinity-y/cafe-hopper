import { CustomModel, pool } from '../../orm/custom';
import { ICafe } from '../interfaces/cafe.interface';
import { ICafeServiceAPI } from '../interfaces/cafe.service.interface';

const cafeModel = new CustomModel('Cafe');

const cafeService: ICafeServiceAPI = {
  async getAllCafes(): Promise<ICafe[]> {
    return cafeModel.findMany();
  },

  // Just to be safe, creating a new getAllCafes
  async getTopCafes(): Promise<ICafe[]> {
    const q = `
      SELECT * FROM "Cafe"
      ORDER BY "googleRating" DESC;
    `;
    
    const { rows } = await pool.query(q);
    return rows;
  },

  async getCafeById(id: number): Promise<ICafe | null> {
    return cafeModel.findUnique(id);
  },

  async searchCafes(term: string): Promise<ICafe[]> {
    const q = `
    SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%' || $1 || '%')
      ORDER BY name;
  `;
    const { rows } = await pool.query(q, [term]);
    return rows;
  },

};

export default cafeService;
