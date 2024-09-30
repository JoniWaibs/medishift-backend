import jwt, { JwtPayload } from "jsonwebtoken";
import { envs } from "../../config/envs";

export class AuthService {
  public static generateToken({id, email}: {id: string, email: string} ): string {
    return jwt.sign({ id, email }, envs.JWT_SECRET_KEY, { expiresIn: envs.JWT_EXPIRES_IN });
  }

  public static verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, envs.JWT_SECRET_KEY);
  }
}