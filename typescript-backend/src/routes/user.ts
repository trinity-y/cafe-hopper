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

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(parseInt(id, 10)); 
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

export default router;
