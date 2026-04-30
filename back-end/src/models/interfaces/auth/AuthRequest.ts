import { Request } from 'express';

export interface AuthRequest extends Request {
  user: any; // You can replace 'any' with a User entity or interface if needed
}
