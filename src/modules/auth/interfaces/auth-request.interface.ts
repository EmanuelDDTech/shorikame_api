import { Request } from 'express';
import { UserInterface } from './user.interface';

export interface AuthRequest extends Request {
  user?: UserInterface;
}
