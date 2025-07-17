export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export interface IReaction {
  id: number;
  uID: number;
  rID: number;
  reaction: ReactionType;
}

export type CreateReactionDTO = Omit<IReaction, 'id'>;