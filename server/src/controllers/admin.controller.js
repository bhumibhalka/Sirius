import { Op } from "sequelize";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.js";

export const getUsers = asyncHandler(async(req,res,next) => {
  const {page =1 , limit= 10, search = '', role = 'all'} = req.query;
  
  const offset = (page - 1) * limit;
  
 const where = {} ;
 if( role !== 'all' ) where.role = role;
 if(search) {
  where[Op.or] = [
    { username : { [Op.iLike]: `%${search}`}},
    { email : { [Op.iLike]: `%${search}`}},
  ];
 } 

 const { count, rows: idRows } = await User.findAndCountAll({
  where, 
  attributes: ['id'],
  order: [['createdAt', 'DESC']],
  limit: parseInt(limit),
  offset: parseInt(offset),
 });

 const userIds = idRows.map(u => u.id);
 const users = await User.findAll({
  where: {id: userIds},
  include: [{
    model: Profile,
    as: 'profile',
    attributes: ['avatar', 'displayName']
  }],
  order: [['createdAt', 'DESC']]
 })

 res.status(200).json({
  success: true,
  totalUsers: count,
  totalPages: Math.ceil(count / limit),
  currentPage : parseInt(page),
  data: users,
 })

})