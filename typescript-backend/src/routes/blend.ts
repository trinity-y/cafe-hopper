import { Router, Request, Response } from 'express';
import blendService from '../services/blend.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
        const goated_cafes = await blendService.getBlend(userId);
        res.status(200).json(goated_cafes);
    } catch (error) {
        console.error('Error fetching cafes:', error);
    }
});

export default router;
