import { ICafe } from './cafe.interface';

export interface IBlendServiceAPI {
  getBlend(userId: number): Promise<ICafe[]>;
}