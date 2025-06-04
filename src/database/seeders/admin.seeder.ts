import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import logger from '../../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

export const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }

    // Create admin user directly without hooks
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    await User.create(
      {
        email: process.env.ADMIN_EMAIL!,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        isVerified: true,
      },
      { hooks: false },
    ); // Disable hooks since we already hashed the password

    logger.info('Admin user created successfully');
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    throw error;
  }
};
