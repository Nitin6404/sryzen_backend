import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../../database/models/user.model';
import { AppError } from '../middleware/error.middleware';
import emailService from '../../services/email.service';

export class AuthService {
  async register(userData: any) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      ...userData,
      verificationToken,
    });

    await emailService.sendVerificationEmail(user.email, verificationToken);

    const { accessToken, refreshToken } = this.generateTokens(user.id);

    return { user, accessToken, refreshToken };
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

    if (!user.isVerified) {
      throw new AppError(401, 'Please verify your email first');
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    return { user, accessToken, refreshToken };
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      throw new AppError(400, 'Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };
      const { accessToken, refreshToken } = this.generateTokens(decoded.userId);
      console.log(accessToken, refreshToken); // Add this line to log the values of accessToken and refreshToken
      return { accessToken, refreshToken };
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  private generateTokens(userId: number) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
