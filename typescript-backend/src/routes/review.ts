import { Router, Request, Response } from 'express';
import reviewService from '../services/review.service'; 
import { CreateReviewDTO, UpdateReviewDTO } from '../interfaces/review.interface';

const router = Router();

// Get all reviews
router.get('/', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getAllReviews(); 
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get all reviews from a user
router.get('/user', async (req: Request, res: Response) => {
  const uid = parseInt(req.query.uid as string, 10);
  try {
    const userReviews = await reviewService.getAllReviewsFromUser(uid);
    res.status(200).json(userReviews);
  } catch (error) {
    console.error(`Could not check for reviews associated with user ${uid}:`, error);
    res.status(500).json({ message: `Could not check for reviews associated with user.` });
  }
});

// Get all reviews from a cafe
router.get('/cafe', async (req: Request, res: Response) => {
  const cid = parseInt(req.query.cid as string, 10);
  try {
    const cafeReviews = await reviewService.getAllReviewsFromCafe(cid);
    res.status(200).json(cafeReviews);
  } catch (error) {
    console.error(`Could not check for reviews associated with cafe ${cid}:`, error);
    res.status(500).json({ message: `Could not check for reviews associated with cafe.` });
  }
});

// Update review with a certain ID, UpdateReviewDTO expected input body structure
// rating: number;
//   foodRating?: number;
//   drinkRating?: number;
//   atmosphereRating?: number;
//   notes?: string;
router.patch('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const inputReview = req.body as UpdateReviewDTO;
  try {
    await reviewService.editReview(id, inputReview); 
    res.status(200).json(`Successfully updated review with id ${id}`);
  } catch (error) {
    console.error(`Error updating review with id ${id}:`, error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

// Create a review
router.post('/', async (req: Request, res: Response) => {
  const inputReview = req.body as CreateReviewDTO;
  try {
    const newReview = await reviewService.createReview(inputReview);
      if (newReview) {
        res.status(201).json(newReview);
      } else {
        res.status(500).json({ message: `Could not create review. New review not returned.` });
      }
      return newReview;
  } catch (error) {
    console.error(`Error creating review:`, error)
    res.status(500).json({ message: `Error creating review. ` });
  }
});

router.post('/delete/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const deletedReview = await reviewService.deleteReview(id);
    if (deletedReview){
      res.status(200).json(`Successfully deleted review with id ${id}`)
    } else {
      res.status(500).json({ message: `Error deleting review with id ${id} ` });
    }
    return deletedReview;
  } catch (error) {
    console.error(`Error deleting review with id ${id}:`, error)
    res.status(500).json({ message: `Error deleting review. ` });
  }
})

export default router;
