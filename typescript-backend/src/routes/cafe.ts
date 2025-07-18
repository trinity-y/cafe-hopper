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

// changed into digits-only parameter
router.get('/:id(\\d+)', async (req: Request, res: Response) => {
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


router.get('/search', async (req: Request, res: Response) => {
  const term = (req.query.search as string)?.trim() || '';

  try {
    // If there's a non-empty search term, do search; otherwise get all
    const cafes = term
      ? await cafeService.searchCafes(term)
      : await cafeService.getAllCafes();

    return res.status(200).json(cafes);
  } catch (error) {
    console.error('Error fetching cafes:', error);
    return res.status(500).json({ message: 'An error occurred while fetching cafés.' });
  }
});

export default router;
