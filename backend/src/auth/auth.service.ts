import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private username = process.env.ADMIN_USERNAME || 'Admin@1';
  private password = process.env.ADMIN_PASSWORD || 'Sukoon@2026';
  private secret = process.env.JWT_SECRET || 'change_this_secret';
  private expiresIn = process.env.JWT_EXPIRES_IN || '2h';

  async login(username: string, password: string) {
    if (String(username) === String(this.username) && String(password) === String(this.password)) {
      const payload = { sub: username };
      return jwt.sign(
        payload,
        this.secret as jwt.Secret,
        { expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'] }
      );
    }
    return null;
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secret);
    } catch (e) {
      return null;
    }
  }
}
