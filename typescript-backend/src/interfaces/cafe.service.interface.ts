import { ICafe, ICafeWithDistance } from './cafe.interface';
import { ICafeFilters } from './filters.interface';

export interface ICafeServiceAPI {
  getAllCafes(): Promise<ICafe[]>;
  getTopCafes(): Promise<ICafe[]>;
  getCafeById(id: number): Promise<ICafe | null>;
  searchCafes(term: string): Promise<ICafe[]>;
  getFilteredCafes(filters: ICafeFilters): Promise<ICafeWithDistance[]>;
}
