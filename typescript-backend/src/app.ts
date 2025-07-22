import express from 'express';
import { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import cafeRoutes from './routes/cafe';
import reviewRoutes from './routes/review';
import reactionRoutes from './routes/reactions';
import bookmarkRoutes from './routes/bookmark';

const app: Application = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/cafes', cafeRoutes);
app.use('/reviews', reviewRoutes);
app.use('/reactions', reactionRoutes); // def going to be implemented on top of the reviews route
app.use('/bookmarks', bookmarkRoutes);

export default app;
