import { ICafe } from './cafe.interface';

export interface ICafeServiceAPI {
  getAllCafes(): Promise<ICafe[]>;
  getTopCafes(): Promise<ICafe[]>;
  getCafeById(id: number): Promise<ICafe | null>;
  searchCafes(term: string): Promise<ICafe[]>;
}
