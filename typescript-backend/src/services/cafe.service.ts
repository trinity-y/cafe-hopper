import { CustomModel, pool } from '../../orm/custom';
import { ICafe, ICafeWithDistance } from '../interfaces/cafe.interface';
import { ICafeFilters } from '../interfaces/filters.interface';
import { ICafeServiceAPI } from '../interfaces/cafe.service.interface';
import { isCafeOpenAt } from '../../utils/timeFilter';

const cafeModel = new CustomModel('Cafe');

const cafeService: ICafeServiceAPI = {
  async getAllCafes(): Promise<ICafe[]> {
    return cafeModel.findMany();
  },

  // Just to be safe, creating a new getAllCafes
  async getTopCafes(): Promise<ICafe[]> {
    const q = `
      SELECT * FROM "Cafe"
      ORDER BY "googleRating" DESC NULLS LAST;
    `;
    
    const { rows } = await pool.query(q);
    return rows;
  },
  
  async getFilteredCafes(filter: ICafeFilters): Promise<ICafeWithDistance[]> {
    let query = '';
    let params: any[] = [];

    if (filter.rating && this.getFilterCount(filter) == 1) {
      query = `
        SELECT * FROM "Cafe" 
        WHERE "googleRating" >= $1 
        ORDER BY "googleRating" DESC, name ASC;
      `;
      params = [filter.rating];
    }
    else if(filter.longitude && filter.latitude && filter.radius && this.getFilterCount(filter) == 1) {
      query = `
        SELECT *, 
          -- HAVERSINE FORMULA 🤩
          (6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )) AS distance
        FROM "Cafe"
        WHERE (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) <= $3
        ORDER BY distance ASC, "googleRating" DESC;
      `;
      params = [filter.latitude, filter.longitude, filter.radius];
    }
    else if(filter.date && this.getFilterCount(filter) == 1) {
      let query = 'SELECT * FROM "Cafe"';

      const { rows } = await pool.query(query);

      return isCafeOpenAt(filter.date, rows);
    }
    else if (this.getFilterCount(filter) === 2 && filter.rating && filter.date) {
      query  = `
        SELECT * FROM "Cafe"
        WHERE "googleRating" >= $1
        ORDER BY "googleRating" DESC, name ASC;
      `;
      params = [filter.rating];

      const { rows } = await pool.query(query, params);

      return isCafeOpenAt(filter.date, rows);
    }
    else if (this.getFilterCount(filter) === 2 && filter.rating && filter.latitude && filter.longitude && filter.radius) {
      query = `
        SELECT *, 
          (6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )) AS distance
        FROM "Cafe"
        WHERE "googleRating" >= $4 
        AND (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) <= $3
        ORDER BY distance ASC, "googleRating" DESC;
      `;
      params = [filter.latitude, filter.longitude, filter.radius, filter.rating];
    }
    else if (this.getFilterCount(filter) === 2 && filter.date && filter.latitude && filter.longitude && filter.radius) {
      query = `
        SELECT *, 
          (6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )) AS distance
        FROM "Cafe"
        WHERE (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) <= $3
        ORDER BY distance ASC, "googleRating" DESC;
      `;
      params = [filter.latitude, filter.longitude, filter.radius];

      const { rows } = await pool.query(query, params);
      return isCafeOpenAt(filter.date, rows);
    }
    else if (this.getFilterCount(filter) === 3 && filter.rating && filter.date && filter.latitude && filter.longitude && filter.rating) {
      query = `
        SELECT *, 
          (6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )) AS distance
        FROM "Cafe"
        WHERE "googleRating" >= $4 
        AND (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) <= $3
        ORDER BY distance ASC, "googleRating" DESC;
      `;
      params = [filter.latitude, filter.longitude, filter.radius, filter.rating];

      const { rows } = await pool.query(query, params);
      return isCafeOpenAt(filter.date, rows);
    } else {
      query  = `
        SELECT * FROM "Cafe"
        ORDER BY "googleRating" DESC, name ASC;
      `;
      params = [];
    }

    const { rows } = await pool.query(query, params);
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
