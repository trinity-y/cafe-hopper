import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import userRoutes from './routes/user';
import cafeRoutes from './routes/cafe';
import reactionRoutes from './routes/reactions';

const app: Application = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/cafes', cafeRoutes);
app.use('/reactions', reactionRoutes); // def going to be implemented on top of the reviews route

export default app;
