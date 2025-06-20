export interface IReview {
  id: number;
  rating: number;
  foodRating?: number;
  drinkRating?: number;
  atmosphereRating?: number;
  notes?: string;
  uid: number;
  cid: number;
}
export type CreateReviewDTO = Omit<IReview, 'id'>;
// This is for updating, we don't want any of the id's and just the updated ratings
// ID will be a seperate input field
export type UpdateReviewDTO = Partial<Omit<IReview, 'id' & 'uid' & 'cid'>>;