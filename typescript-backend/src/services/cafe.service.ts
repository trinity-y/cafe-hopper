import { CustomModel, pool } from '../../orm/custom';
import { ICafe } from '../interfaces/cafe.interface';
import { ICafeServiceAPI } from '../interfaces/cafe.service.interface';

const cafeModel = new CustomModel('Cafe');

const cafeService: ICafeServiceAPI = {
  async getAllCafes(): Promise<ICafe[]> {
    return cafeModel.findMany();
  },

  async getTopCafes(): Promise<ICafe[]> {
    const viewTopCafes = `
      DROP VIEW IF EXISTS "TopCafes";

      CREATE VIEW "TopCafes" AS
      SELECT * FROM "Cafe"
      WHERE "googleRating" IS NOT NULL
      ORDER BY "googleRating" DESC;
    `;

    await pool.query(viewTopCafes);

    const q = `
      SELECT * FROM "TopCafes"
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
  async searchCafesPriceRange(term: string, startPrice: number, endPrice: number): Promise<ICafe[]> {
    const hasTermFilter = term && term.trim() !== '';
    const roundDownStartPrice = Math.floor(startPrice / 10) * 10;
    const roundUpEndPrice = Math.ceil(endPrice / 10) * 10;
    const q = `
    SELECT * FROM "Cafe" 
    WHERE ${hasTermFilter ? `LOWER(name) LIKE LOWER('%' || $1 || '%') AND` : ''}
    (startPrice >= $${hasTermFilter ? 2 : 1} 
    AND endPrice <= $${hasTermFilter ? 3 : 2})
    ORDER BY name;
    `;
    console.log(q);
    
    const params = hasTermFilter ? [term.trim(), roundDownStartPrice, roundUpEndPrice] : [roundDownStartPrice, roundUpEndPrice];
    const { rows } = await pool.query(q, params);
    return rows;
  },

};

export default cafeService;
