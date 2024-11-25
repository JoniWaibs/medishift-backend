import jwt, { JwtPayload } from 'jsonwebtoken';
import { envs } from '../../config/envs';
import { UserRole } from '../../core/enums';

export class AuthService {
  static generateToken({ id, email, role }: { id: string; email: string; role: UserRole }): string {
    return jwt.sign({ id, email, role }, envs.JWT_SECRET_KEY, { expiresIn: envs.JWT_EXPIRES_IN });
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
