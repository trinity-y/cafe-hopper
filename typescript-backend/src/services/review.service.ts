import { CustomModel } from '../../orm/custom';
import { IReview, CreateReviewDTO, UpdateReviewDTO } from '../interfaces/review.interface';
import { IReviewServiceAPI } from '../interfaces/review.service.interface'; 

const reviewModel = new CustomModel('Reviews');

const reviewService: IReviewServiceAPI = {
    async getAllReviewsFromUser (uid: number) : Promise<IReview[] | null>{
        const where = {'uid': uid};
        return reviewModel.findMany(where);
    },
    async getAllReviewsFromCafe (cid: number) : Promise<IReview[] | null>{
        const where = {'cid': cid};
        return reviewModel.findMany(where);
    },
    async getAllReviews () : Promise<IReview[] | null>{
        return reviewModel.findMany();
    },
    async createReview (review: CreateReviewDTO) : Promise<IReview>{
        return reviewModel.create(review);
    },
    async editReview (id: number, review: UpdateReviewDTO){
        try {
            reviewModel.updateMany(id, review);
        } catch(e){
            throw e;
        }
    },
    async deleteReview (id: number) : Promise<boolean>{
        return reviewModel.delete(id);
    }
}

export default reviewService;