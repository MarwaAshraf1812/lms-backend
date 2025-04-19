import express from 'express';
import { registerController, loginController } from './auth.controller';

const router = express.Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);



export default router;