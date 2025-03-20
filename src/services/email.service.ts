import nodemailer from 'nodemailer';
import { AppError } from '../api/middleware/error.middleware';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

    try {
      await this.transporter.verify(); // Verify SMTP connection
      logger.info('SMTP connection verified successfully');

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Verify your email address',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        `,
      });
      logger.info('Verification email sent successfully');
    } catch (error) {
      logger.error('Email error:', error);
      throw new AppError(500, 'Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    try {
      await this.transporter.verify(); // Verify SMTP connection
      logger.info('SMTP connection verified successfully');

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        `,
      });
      logger.info('Password reset email sent successfully');
    } catch (error) {
      logger.error('Email error:', error);
      throw new AppError(500, 'Failed to send password reset email');
    }
  }
}

export default new EmailService();
