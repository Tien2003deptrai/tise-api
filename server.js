import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import postsRouter from './src/routes/posts.js';
import errorHandler from './src/middleware/error.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

// routes
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/posts', postsRouter);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongo connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});
process.on('SIGINT', () => {
  console.log('Shutting down...');
  mongoose.disconnect().finally(() => process.exit(0));
});

start();
