import Profile from "../DBmodels/profile.model.js";
import { sequelize } from "../lib/db.js";
import { ENV } from "../lib/ENV.js";
import { generateToken } from "../lib/token.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import User from "../models/user.js";

export const register = async(req,res,next) => {
  const {username, email, password, displayName, role} = req.body;

// 1. Start a Managed Transaction in PostgreSQL
  const t = await sequelize.transaction();

  try {
    const exisitingUser = await User.findOne({ where: {email}, transaction: t})

    if(exisitingUser){
          await t.rollback();
    return res.status(400).json({message: 'Email already registered'})
    }
  

  const newUser = await User.create({
    username,
    email,
    password,
    status: 'active',
    role: role || 'user',
  },{ transaction: t});

  const newProfile = new Profile({
    accountId: newUser.id, //Linking UUID to Mongo String
    displayName: displayName || username,
    interests: [], //Initalize for AI recommendation
  })

 await newProfile.save();

 //token generate
   const token = await generateToken(newUser.id);

 //Commit PostgresSQL transaction now that MongoDB is successful
 await t.commit();


 return res.status(201).cookie('token',token, {
  httpOnly: true,
  sameSite: 'strict',
  secure: ENV.NODE_ENV === "production"
 }).json({
  success: true,
  token,
  user: newUser,
  profile: newProfile,
 })
} catch (error) {
  
 if (t && !t.finished) {
  await t.rollback();
}

  console.log(`Registeration Error:`,error)

  return res.status(500).json({
    success: false,
    message: 'System error during registeration. Please try again.'
  })
  }
}

export const login = async(req,res,next) => {
  const {email, password} = req.body;

  try {
  const user = await User.findOne({where: {email}});
  if(!user || !await user.comparePassword(password)){
    return next(new ErrorHandler("Invaild Credentails.",401))
  }

  const profile = await Profile.findOne({accountId: user.id})


  //Update last login DATE
  user.lastLogin = new Date();
  await user.save();


  //dual token

  const token = await generateToken(user.id);
  //redis

  return res.status(200).cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: ENV.NODE_ENV === "production"
  }).json({
    success: true,
    message: 'User logged in successfully',
    user,
    profile
  })

  } catch (error) {
    console.log(`Login Error:`, error);
    return next(new ErrorHandler("Internal Server Error",500))
  }

 

}