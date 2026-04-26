import jwt from 'jsonwebtoken'
import { ENV } from './ENV.js'

export const generateToken = (userId) => {
  return jwt.sign({_id: userId}, ENV.TOKEN_SECRET, {
    expiresIn: '7d'
  })
}