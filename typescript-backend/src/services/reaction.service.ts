import { CustomModel } from '../../orm/custom';
import { IReaction, CreateReactionDTO } from '../interfaces/reactions.interface';
import { IReactionService, GetReactionsOptions} from '../interfaces/reactions.service.interface';

const reactionModel = new CustomModel('Reaction');

const reactionService: IReactionService = {
    async getReactions(options?: GetReactionsOptions): Promise<any> {
        if (options?.reviewId && options?.userId) {
            return reactionModel.findMany({ uID: options.userId, rID: options.reviewId });
        } else if (options?.reviewId) {
            const reactions = await reactionModel.findMany({ rID: options.reviewId, reaction: 'like' });
            return reactions.length;
        } else {
            return reactionModel.findMany();
        }
    },

    async createReaction(reactionData: CreateReactionDTO): Promise<IReaction> {
        const existingReaction = await reactionModel.findMany({
            uID: reactionData.uID,
            rID: reactionData.rID
        });

        if (existingReaction.length > 0) {
            throw new Error('Reaction already exists!');
        }

        return reactionModel.create(reactionData);
    },

    async deleteUserReactionForReview(userId: number, reviewId: number): Promise<IReaction | null> {
        const existingReaction = await reactionModel.findMany({ 
            uID: userId, 
            rID: reviewId 
        });
    
        if (existingReaction.length === 0) {
            return null;
        }

        const deletedObject = await reactionModel.delete(existingReaction[0].id);
        return deletedObject;
    }
};

export default reactionService;