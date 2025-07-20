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

router.get('/emailExists', async (req: Request, res: Response) => {
  const email = req.query.email as string;
  try {
    const doesEmailExist = await userService.doesEmailExist(email);
    res.status(200).json(doesEmailExist);
  } catch (error) {
    console.error(`Could not check if email is already associated with a user for email ${email}:`, error);
    res.status(500).json({ message: `Could not check if email is already associated with a user.` });
  }
});

router.get('/usernameExists', async (req: Request, res: Response) => {
  const username = req.query.username as string;
  try {
    const doesUsernameExist = await userService.doesUsernameExist(username);
    res.status(200).json(doesUsernameExist);
  } catch (error) {
    console.error(`Could not check if the username "${username}" already exists:`, error);
    res.status(500).json({ message: `Could not check if the username already exists.` });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  const username = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const userId = parseInt(req.query.userId as string, 10);

  if (!username) {
    return res.status(400).json({ message: 'Missing or empty search term.' });
  }

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid or missing userId.' });
  }

  try {
    const users = await userService.searchUsers(username, userId);
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error searching users with username "${username}":`, error);
    res.status(500).json({ message: 'An error occurred while searching for users.' });
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

router.get('/firebase/:firebase_uid', async (req: Request, res: Response) => {
  const { firebase_uid } = req.params;
  try {
    const user = await userService.getUserByFirebaseId(firebase_uid); 
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with firebase_uid ${firebase_uid} not found` });
    }
  } catch (error) {
    console.error(`Error fetching user with firebase_uid ${firebase_uid}:`, error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { username, firebase_uid } = req.body;
  try {
    const newUser = await userService.createUser({ username, firebase_uid });
      if (newUser) {
        res.status(201).json(newUser);
      } else {
        res.status(500).json({ message: `Could not create user with username ${username}. New user not returned.` });
      }
  } catch (error) {
    console.error(`Error creating user with username ${username}:`, error)
    res.status(500).json({ message: `Error creating user with username ${username}. ` });
  }
})

export default router;
