// src/types/auth.ts
export interface JwtUserPayload {
  id: string;
  role: 'ADMIN'| 'STUDENT'| 'INSTRUCTOR';
}


declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}