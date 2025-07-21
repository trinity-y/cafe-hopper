import { Router, Request, Response } from 'express';
import friendService from '../services/friend.service';

const router = Router();

router.get('/mutuals/:user_id', async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const userMutuals = await friendService.getUserMutualsByUserId(parseInt(user_id, 10));
    res.status(200).json(userMutuals);
  } catch (error) {
    console.error('Error fetching cafes:', error);
  }
});

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

router.delete('/:user_id/:following_id', async (req: Request, res: Response) => {
  const { user_id, following_id } = req.params;
  
  try {
    const deleted = await friendService.deleteFriend(Number(user_id), Number(following_id));

    if (deleted) {
      res.status(200).json({ message: 'Friendship deleted.' });
    } else {
      res.status(404).json({ message: `Friendship not found.` });
    }
  } catch (error) {
    console.error(`Error: user could not unfollow user with uid ${following_id} :`, error)
    res.status(500).json({ message: `Error: user could not unfollow user with uid ${following_id}.` });
  }
});

export default router;
