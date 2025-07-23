export interface ICafe {
  id: number;
  name: string;
  address: string;
  openingDays: string;
  googleRating: number;
  startPrice: number;
  endPrice: number;
}

export interface ICafeWithDistance extends ICafe {
  distance: number;
}