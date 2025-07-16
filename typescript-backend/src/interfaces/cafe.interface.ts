export interface ICafe {
  id: number;
  name: string;
  address: string;
  openingDays: string;
  googleRating: number;
}

export interface ICafeWithRating extends ICafe {
  finalRating: number;
}