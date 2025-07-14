import { ICafe } from './cafe.interface';

export interface IBlendServiceAPI {
  getBlend(): Promise<ICafe[]>;
}