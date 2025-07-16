export interface ICafe {
  id: number;
  name: string;
  address: string;
  openingDays: string;
  googleRating: number;
  startPrice: number;
  endPrice: number;
}

export interface ICafeWithRating extends ICafe {
  finalRating: number;
}