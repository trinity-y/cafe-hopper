import app from './app';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});