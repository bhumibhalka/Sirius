import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import { ENV } from "../lib/ENV.js";
// import "../models/user.model.js";

export const connectDB = async() => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`Failed to connect MongoDB:`,error);
    process.exit(1);
  }
}

//  export const sequelize = new Sequelize(
//   ENV.PG_NAME,
//   ENV.PG_USER,
//   ENV.PG_PASSWORD,
//   {
//     host: ENV.PG_HOST,
//     port:Number (ENV.PG_PORT),
//     dialect: "postgres",
//     dialectOptions: {require: true, rejectUnauthorized: false}
//   }
//  )

const sequelize = new Sequelize(ENV.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const pgConnection = async() => {
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.')

  await sequelize.sync({ alter: true })
} catch (error) {
  console.log('Unable to connect to postgres database:', error)
  process.exit(1);
}
}

