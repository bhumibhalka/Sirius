import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5001,
  FRONTEND_URL: process.env.FRONTEND_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  PG_USER: process.env.PG_USER,
  PG_HOST: process.env.PG_HOST,
  PG_NAME: process.env.PG_NAME,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_PORT: process.env.PG_PORT,
  CLOUDIANRY_CLOUD_NAME: process.env.CLOUDIANRY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

}