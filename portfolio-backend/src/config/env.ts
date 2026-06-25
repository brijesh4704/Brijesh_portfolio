// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define the shape of the environment variables
interface Env {
    PORT: number;
    NODE_ENV: string;
    DATABASE_URL: string;

    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
}

// Validate and export environment variables
const env: Env = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
};

// Validate required environment variables
if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env');
}

if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error('SMTP configuration is not defined in .env');
}

export default env;

// This snippet loads environment variables from a .env file, defines the shape of the environment variables, validates the required environment variables, and exports the environment variables for use in other parts of the application.
