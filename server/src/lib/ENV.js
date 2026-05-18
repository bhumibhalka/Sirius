import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5001,
  FRONTEND_URL: process.env.FRONTEND_URL?.trim() ,
  TOKEN_SECRET: process.env.TOKEN_SECRET?.trim() ,
  NODE_ENV: process.env.NODE_ENV?.trim() ,
  MONGO_URI: process.env.MONGO_URI?.trim() ,
  PG_USER: process.env.PG_USER?.trim() ,
  PG_HOST: process.env.PG_HOST?.trim() ,
  PG_NAME: process.env.PG_NAME?.trim() ,
  PG_PASSWORD: process.env.PG_PASSWORD?.trim() ,
  PG_PORT: process.env.PG_PORT?.trim() ,
  CLOUDIANRY_CLOUD_NAME: process.env.CLOUDIANRY_CLOUD_NAME?.trim(),
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim(),
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim(),
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY?.trim() ,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET?.trim() ,
  DATABASE_URL: process.env.DATABASE_URL?.trim() ,
  
}