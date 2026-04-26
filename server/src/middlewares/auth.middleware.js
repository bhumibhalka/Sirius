import jwt from 'jsonwebtoken';
import ErrorHandler from './error.middleware';
import { ENV } from '../lib/ENV';
import User from '../models/user';

export const isAuthenticated = async() => {
  const token = res.cookies.token;
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