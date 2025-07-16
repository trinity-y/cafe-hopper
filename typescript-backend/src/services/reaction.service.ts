import { CustomModel } from '../../orm/custom';
import { IReaction, CreateReactionDTO } from '../interfaces/reactions.interface';
import { IReactionService, GetReactionsOptions} from '../interfaces/reactions.service.interface';

const reactionModel = new CustomModel('Reaction');

const reactionService: IReactionService = {
    async getAllReactions(rID: number): Promise<number> {
        const query = `
            SELECT COUNT(*) AS like_count
            FROM "Reaction"
            WHERE rID = $1 AND reaction = 'like'
        `;
        const result = await reactionModel.rawQuery(query, [rID]);
        return Number(result[0]?.like_count ?? 0);
    },

    async getReactionsByReview(options: GetReactionsOptions): Promise<IReaction[]> {
        if (options.userId) {
            const reaction = await reactionModel.findMany({ 
                uID: options.userId, 
                rID: options.reviewId 
            });
            return reaction;
        } else {
            return reactionModel.findMany({ rID: options.reviewId });
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