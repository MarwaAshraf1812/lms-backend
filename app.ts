import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
dotenv.config();

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('LMS Backend Running');
});


app.use('/api/auth', authRoutes);

export default app;