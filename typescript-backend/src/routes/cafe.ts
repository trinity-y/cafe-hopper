import { Router, Request, Response } from 'express';
import cafeService from '../services/cafe.service'; 

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  
  try {
    const cafes = await cafeService.getAllCafes(); 
    res.status(200).json(cafes);
  } catch (error) {
    console.error('Error fetching cafes:', error);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cafe = await cafeService.getCafeById(parseInt(id, 10)); 
    if (cafe) {
      res.status(200).json(cafe);
    } else {
      res.status(404).json({ message: `Cafe with id ${id} not found` });
    }
  } catch (error) {
    console.error(`Error fetching cafe with id ${id}:`, error);
    res.status(500).json({ message: 'Error fetching cafe' });
  }
});

export default router;
