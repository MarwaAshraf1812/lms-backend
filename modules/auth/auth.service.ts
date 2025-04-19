import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, userRole } from '../../config/prisma';
import { registerUserSchema, loginUserSchema } from './auth.dto';

const JWT_SECRET = process.env.JWT_SECRET;
interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}


export const registerUser = async (userData: User) => {
  try {
    const parsedData = registerUserSchema.parse(userData);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    })

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        password: hashedPassword,
        role: parsedData.role.toUpperCase() as keyof typeof userRole,
      },
    })
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
  } catch (error) {
    throw new Error('Error registering user');
    
  }
}


export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const parsedData = loginUserSchema.parse(userData);
    const user = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });
    if (!user || !(await bcrypt.compare(parsedData.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
    return {
      token,
    };

  } catch (error) {
    throw new Error('Error logging in user');
  }
}