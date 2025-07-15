import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import courseRoutes from './modules/course/course.routes';
import categoryRoutes from "./modules/category/category.routes";
import aiRoutes from './modules/ai/ai.routes';
import quizRoutes from './modules/quiz/quiz.routes';
dotenv.config();

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('LMS Backend Running');
});


app.use('/auth/', authRoutes);
app.use('/api/courses/', courseRoutes);
app.use('/api/categories/', categoryRoutes);
app.use('/api/ai/', aiRoutes);
app.use('/api/quizzes/', quizRoutes);

export default app;