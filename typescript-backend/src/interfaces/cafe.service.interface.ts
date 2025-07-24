import { ICafe } from './cafe.interface';

export interface ICafeServiceAPI {
  getAllCafes(): Promise<ICafe[]>;
  getCafeById(id: number): Promise<ICafe | null>;
  searchCafes(term: string): Promise<ICafe[]>;
  getTopCafes(): Promise<ICafe[]>;
  searchCafesPriceRange(term: string, startPrice: number, endPrice: number): Promise<ICafe[]>;
}
