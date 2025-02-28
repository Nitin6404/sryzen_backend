import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../../database/models/user.model';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  async register(userData: any) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const user = await User.create(userData);
    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }

  private generateToken(userId: number): string {
    const secretOrPublicKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    if (!secretOrPublicKey) {
      throw new Error('JWT_SECRET is not defined');
    }

    if (!expiresIn) {
      throw new Error('JWT_EXPIRES_IN is not defined');
    }
    return jwt.sign({ userId }, secretOrPublicKey, options);
  }
}

export default new AuthService();
