import * as bcrypt from 'bcryptjs';
import config from './config'; // Assuming you're importing configuration from a valid config file

import { BadRequestException } from '@nestjs/common';


export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = config.PASSWORD_SALT_ROUNDS ?? 10; // Default to 10 if not provided
    return await bcrypt.hash(password, saltRounds); // Use await to ensure the promise resolves
  } catch (error) {
    console.error('Error hashing password:', error); // Log the error for debugging
    throw new BadRequestException('Password hashing failed');
  }
};


export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword); // Compare plain password with hashed password
  } catch (error) {
    console.error('Error comparing passwords:', error); // Log the error for debugging
    throw new BadRequestException('Password comparison failed');
  }
};
