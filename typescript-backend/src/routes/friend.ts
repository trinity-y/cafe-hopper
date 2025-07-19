import { Router, Request, Response } from 'express';
import friendService from '../services/friend.service';

const router = Router();

router.get('/:user_id', async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const userFriends = await friendService.getUserFriendsByUserId(parseInt(user_id, 10));
    res.status(200).json(userFriends);
  } catch (error) {
    console.error('Error fetching cafes:', error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { user_id, following_id } = req.body;
  try {
    const newFriend = await friendService.createFriend({ user_id, following_id });
      if (newFriend) {
        res.status(201).json(newFriend);
      } else {
        res.status(500).json({ message: `User with uid ${user_id} could not follow user with uid ${following_id}. New friend entry not returned.` });
      }
  } catch (error) {
    console.error(`Error: user could not follow user with uid ${following_id} :`, error)
    res.status(500).json({ message: `Error: user could not follow user with uid ${following_id}.` });
  }
});

export default router;
