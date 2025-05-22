import app from './app';

const PORT: number = 3001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});