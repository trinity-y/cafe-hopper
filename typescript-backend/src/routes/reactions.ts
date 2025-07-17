import { Router, Request, Response } from 'express';
import { ReactionType } from '../interfaces/reactions.interface';
import reactionService from '../services/reaction.service'; 
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const reviewId = req.query.reviewId ? parseInt(req.query.reviewId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

    if (reviewId && userId) {
      const reactions = await reactionService.getReactions({ reviewId, userId });
      return res.status(200).json(reactions);
    } else if (reviewId) {
      const like_count = await reactionService.getReactions({reviewId});
      return res.status(200).json({ like_count });
    } else {
      const reactions = await reactionService.getReactions();
      return res.status(200).json(reactions);
    }
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ message: 'Error fetching reactions' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { uID, rID, reaction } = req.body;

    if (!uID || !rID || !reaction) {
      return res.status(400).json({ message: 'uID, rID, and reaction are required' });
    }

    if (!Object.values(ReactionType).includes(reaction)) {
      return res.status(400).json({ 
        message: `Invalid reaction type.` 
      });
    }

    const newReaction = await reactionService.createReaction({ uID, rID, reaction });
    res.status(201).json(newReaction);
  } catch (error) {
    console.error('Error creating reaction:', error);

    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      res.status(409).json({ message: 'User has already reacted to this review' });
    } else {
      res.status(500).json({ message: 'Error creating reaction' });
    }
  }
});

// The routes might not fully make sense right now since it will all be 
// implemented on top of reviews
router.delete('/:userId/:reviewId', async (req: Request, res: Response) => {
  try {
    const { userId, reviewId } = req.params;
    
    if (!userId || !reviewId) {
      return res.status(400).json({ message: 'userId and reviewId are required' });
    }
    
    const deletedReaction = await reactionService.deleteUserReactionForReview(parseInt(userId), parseInt(reviewId));
    
    if (!deletedReaction) {
      return res.status(404).json({ message: 'Reaction not found' });
    }
    
    res.status(200).json({ message: 'Reaction removed successfully', deletedReaction });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    res.status(500).json({ message: 'Error deleting reaction' });
  }
});

export default router;
