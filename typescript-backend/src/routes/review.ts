import { Router, Request, Response } from 'express';
import reviewService from '../services/review.service'; 
import { CreateReviewDTO, UpdateReviewDTO } from '../interfaces/review.interface';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getAllReviews(); 
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

router.get('/user', async (req: Request, res: Response) => {
  const uid = req.query.uid as string;
  try {
    const userReviews = await reviewService.getAllReviewsFromUser(uid);
    res.status(200).json(userReviews);
  } catch (error) {
    console.error(`Could not check for reviews associated with user ${uid}:`, error);
    res.status(500).json({ message: `Could not check for reviews associated with user.` });
  }
});

router.get('/cafe', async (req: Request, res: Response) => {
  const cid = req.query.cid as string;
  try {
    const cafeReviews = await reviewService.getAllReviewsFromCafe(cid);
    res.status(200).json(cafeReviews);
  } catch (error) {
    console.error(`Could not check for reviews associated with cafe ${cid}:`, error);
    res.status(500).json({ message: `Could not check for reviews associated with cafe.` });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const inputReview = req.body as UpdateReviewDTO;
  try {
    const review = await reviewService.editReview(id, inputReview); 
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: `review with id ${id} not found` });
    }
  } catch (error) {
    console.error(`Error fetching review with id ${id}:`, error);
    res.status(500).json({ message: 'Error fetching review' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const inputReview = req.body as CreateReviewDTO;
  try {
    const newReview = await reviewService.createReview(inputReview);
      if (newReview) {
        res.status(200).json(newReview);
      } else {
        res.status(500).json({ message: `Could not create review. New review not returned.` });
      }
  } catch (error) {
    console.error(`Error creating review:`, error)
    res.status(500).json({ message: `Error creating review. ` });
  }
});

router.post('/delete/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const deletedReview = await reviewService.deleteReview(id);
  } catch (error) {
    console.error(`Error deleting review with id ${id}:`, error)
    res.status(500).json({ message: `Error deleting review. ` });
  }
})

export default router;
