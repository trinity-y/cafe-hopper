import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import userRoutes from './routes/user';
import cafeRoutes from './routes/cafe';
import friendRoutes from './routes/friend';
import bookmarkRoutes from './routes/bookmark';

const app: Application = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/cafes', cafeRoutes);
app.use('/friends', friendRoutes);
app.use('/bookmarks', bookmarkRoutes);

export default app;
