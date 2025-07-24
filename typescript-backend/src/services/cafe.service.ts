import { CustomModel, pool } from '../../orm/custom';
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

  async searchCafes(term: string): Promise<ICafe[]> {
    const q = `
    SELECT * FROM "Cafe" WHERE LOWER(name) LIKE LOWER('%' || $1 || '%')
      ORDER BY name;
  `;
    const { rows } = await pool.query(q, [term]);
    return rows;
  },
  async searchCafesPriceRange(term: string, startPrice: number, endPrice: number): Promise<ICafe[]> {
    const hasTermFilter = term && term.trim() !== '';
    console.log(term);
    const q = `
    SELECT * FROM "Cafe" 
    WHERE ${hasTermFilter ? `LOWER(name) LIKE LOWER('%' || $1 || '%') AND` : ''}
    (startPrice >= $${hasTermFilter ? 2 : 1} 
    AND endPrice <= $${hasTermFilter ? 3 : 2})
    ORDER BY name;
    `;
    console.log(q);
    
    const params = hasTermFilter ? [term.trim(), startPrice, endPrice] : [startPrice, endPrice];
    const { rows } = await pool.query(q, params);
    return rows;
  },

};

export default cafeService;
