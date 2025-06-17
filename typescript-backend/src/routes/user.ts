import { Router, Request, Response } from 'express';
import userService from '../services/user.service'; 
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers(); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const user = await userService.getUserById(parseInt(uid, 10)); 
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with uid ${uid} not found` });
    }
  } catch (error) {
    console.error(`Error fetching user with id ${uid}:`, error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { username, firebase_uid } = req.body;
  try {
    const newUser = await userService.createUser({ username, firebase_uid });
      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(500).json({ message: `Could not create user with username ${username}. New user not returned.` });
      }
  } catch (error) {
    console.error(`Error creating user with username ${username}:`, error)
    res.status(500).json({ message: `Error creating user with username ${username}. ` });
  }
})

export default router;
