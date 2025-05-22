import { ICafe } from './cafe.interface';

export interface ICafeServiceAPI {
  getAllCafes(): Promise<ICafe[]>;
  getCafeById(id: number): Promise<ICafe | null>;
}
