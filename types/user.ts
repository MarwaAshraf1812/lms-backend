// src/types/auth.ts
export interface JwtUserPayload {
  id: string;
  role: 'admin' | 'student' | 'teacher';
}


declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}