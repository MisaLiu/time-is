import express from 'express';
import { createServer } from 'http';

const app = express();

app.get('/hello', (_, res) => {
  res.send('Hello world!');
});

const server = createServer(app);
server.listen(3000);
console.log('Server is listening on port 3000');

// For Vite's HMR compatibility
if (import.meta.hot) {
  const close = () => server.close();

  import.meta.hot.accept(close);
  import.meta.hot.dispose(close);
}
