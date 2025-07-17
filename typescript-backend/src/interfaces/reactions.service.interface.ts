import { IReaction, CreateReactionDTO } from './reactions.interface';

export interface GetReactionsOptions {
    reviewId: number;
    userId?: number;
}

export interface IReactionService {
    // getAllReactions(rId: number): Promise<number>;
    getReactions(options?: GetReactionsOptions): Promise<IReaction[]>;
    createReaction(reactionData: CreateReactionDTO): Promise<IReaction>;
    deleteUserReactionForReview(userId: number, reviewId: number): Promise<IReaction | null>;
}