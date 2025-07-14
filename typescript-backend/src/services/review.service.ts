import { CustomModel } from '../../orm/custom';
import { IReview, CreateReviewDTO, UpdateReviewDTO } from '../interfaces/review.interface';
import { IReviewServiceAPI } from '../interfaces/review.service.interface'; 

const reviewModel = new CustomModel('Reviews');

const reviewService: IReviewServiceAPI = {
    async getAllReviewsFromUser (uid: number) : Promise<IReview | null>{
        return reviewModel.findUnique(uid);
    },
    async getAllReviewsFromCafe (cid: number) : Promise<IReview | null>{
        return reviewModel.findUnique(cid);
    },
    async getAllReviews () : Promise<IReview | null>{
        return reviewModel.findMany();
    },
    async createReview (review: CreateReviewDTO){
        reviewModel.create(review);
    },
    async editReview (id: number, review: UpdateReviewDTO){
        reviewModel.updateMany(id, review);
    },
    async deleteReview (id: number){
        reviewModel.delete(id);
    }
}

export default reviewService;