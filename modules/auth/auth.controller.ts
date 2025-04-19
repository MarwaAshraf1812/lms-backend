import { Request, Response } from 'express';
import { registerUser, loginUser } from './auth.service';


export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error) ? error.message : 'Internal Server Error' });
    
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json({
      message: 'User logged in successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error) ? error.message : 'Internal Server Error' });
    
  }
}