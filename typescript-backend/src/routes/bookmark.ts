import { Router, Request, Response } from 'express';
import bookmarkService from '../services/bookmark.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const bookmarks = await bookmarkService.getAllBookmarks(); 
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

router.get('/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const bookmarks = await bookmarkService.getAllBookmarksForUser(parseInt(uid, 10));
    
    if (bookmarks) {
      res.status(200).json(bookmarks);
    } else {
      res.status(404).json({ message: `Bookmarks for user with uid ${uid} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: `Error fetching bookmarks for user with uid ${uid}` });
  }
});

router.get('/bookmarked-cafes/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const bookmarks = await bookmarkService.getBookmarkedCafesForUser(parseInt(uid, 10));
    if (bookmarks) {
        res.status(200).json(bookmarks);
    } else {
        res.status(404).json({message: `Bookmarks for user with uid ${uid} not found`});
    }
  } catch (error) {
    console.error(`Error fetching bookmarked cafes for user with uid ${uid}:`, error);
    res.status(500).json({ message: `Error fetching bookmarks for user with uid ${uid}` });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { uid, cid } = req.body;
  try {
    const bookmarkCreated = await bookmarkService.createBookmark({ uid, cid });
    if (bookmarkCreated) {
        res.status(201).json(bookmarkCreated);
    } else {
        res.status(500).json({ message: 'Could not create bookmark' });
    }
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ message: 'Error creating bookmark' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const bookmarkDeleted = await bookmarkService.deleteBookmark(parseInt(id, 10));
    if (bookmarkDeleted) {
        res.status(200).json({message: 'Bookmark deleted successfully'});
    } else {
        res.status(404).json({ message: `No bookmark with id ${id} found:` });
    }
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Error deleting bookmark' });
  }
});

export default router;
