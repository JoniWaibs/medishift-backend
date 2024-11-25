import jwt, { JwtPayload } from 'jsonwebtoken';
import { envs } from '../../config/envs';

export class TokenService {
  static generateConfirmationToken(id: string): string {
    return jwt.sign({ id }, envs.JWT_SECRET_KEY, { expiresIn: '24h' });
  }

  static verifyToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, envs.JWT_SECRET_KEY);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}