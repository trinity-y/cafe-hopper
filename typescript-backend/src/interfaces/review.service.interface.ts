import { CreateReviewDTO,UpdateReviewDTO, IReview } from './review.interface';

export interface IReviewServiceAPI {
  getAllReviewsFromUser(uid: number): Promise<IReview | null>;
  getAllReviewsFromCafe(cid: number): Promise<IReview | null>;
  getAllReviews(): Promise<IReview | null>;
  createReview(review: CreateReviewDTO);
  editReview(id:number, review: UpdateReviewDTO);
  deleteReview(id: number);
}