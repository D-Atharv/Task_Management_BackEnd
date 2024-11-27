import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT! , 10),
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export default env;
