import app from './app';

const PORT: number = 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});
