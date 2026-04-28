import jwt from 'jsonwebtoken';
import ErrorHandler from './error.middleware.js';
import { ENV } from '../lib/ENV.js';
import User from '../models/user.js';
import { asyncHandler } from './asyncHandler.middleware.js';

export const isAuthenticated = async(req,res,next) => {
  const token = req.cookies.token;
  if(!token){
    return next(new ErrorHandler('Unauthorized: Please login to continue',401))
  }

  const decoded = jwt.verify(token, ENV.TOKEN_SECRET)
  if(!decoded) {
    return next(new ErrorHandler('Unauthorized: Invalid or expired token'))
  }

  const user = await User.findByPk(decoded._id);
 
  req.user = user;

 next()
}

export const isAuthorized = (...roles) => (req,res,next) => {
  if(!roles.includes(req.user.role)){
    return next (new ErrorHandler(`User with role ${req.user.role} cannot access this resource`, 403))
  }

  next()
}