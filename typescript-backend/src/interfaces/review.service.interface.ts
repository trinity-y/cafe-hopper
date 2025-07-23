import { CreateReviewDTO,UpdateReviewDTO, IReview } from './review.interface';

export interface IReviewServiceAPI {
  getAllReviewsFromUser(uid: number): Promise<IReview[] | null>;
  getAllReviewsFromCafe(cid: number): Promise<IReview[] | null>;
  getAllReviews(): Promise<IReview[] | null>;
  getReviewsForFeed(uid: number): Promise<IReview[] | null>;
  createReview(review: CreateReviewDTO) : Promise<IReview | null>;
  editReview(id:number, review: UpdateReviewDTO);
  deleteReview(id: number): Promise<boolean>;
}