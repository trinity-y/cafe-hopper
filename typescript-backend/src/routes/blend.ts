import { Router, Request, Response } from 'express';
import blendService from '../services/blend.service';

const router = Router();

router.get('/:uid', async (req: Request, res: Response) => {
    const uid = req.params.uid;
    
    try {
        const parsedUid = parseInt(uid);
        const goated_cafes = await blendService.getBlend(parsedUid);
        res.status(200).json(goated_cafes);
    } catch (error) {
        console.error('Error fetching blend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
