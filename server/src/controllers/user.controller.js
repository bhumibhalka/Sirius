import Profile from "../DBmodels/profile.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.js";
import {Op} from 'sequelize';

export const getUsers = asyncHandler(async(req,res,next)=> {
   const {search, cursor , limit = 20} =req.query;
   const itemsPerPage = Math.min(limit, 50);

   const whereClause = {role: 'user'};

   if(search) {
    whereClause.username = { [Op.iLike]: `%${search}%`}
   }

   if(cursor){
    whereClause.id = { [Op.gt]: cursor};
   }

   const users = await User.findAll({
    where: whereClause,
    attributes: ['id', 'username', 'createdAt'],
    limit: itemsPerPage,
    order: [['id', 'ASC']],
   })

   if(!users.length){
    return res.status(200).json({success: true, data: [],nextCursor: null})
   }


   const userIds = users.map(u => u.id);
   const profiles = await Profile.find({accountId: {$in: userIds} })
   .select('accountId displayName avatar bio')
   .lean();

   const profileMap = profiles.reduce((acc, p) => ({...acc, [p.accountId]: p}), {})


   const data = users.map(user => ({
    id: user.id,
    username: user.username,
    displayName: profileMap[user.id]?.displayName || user.username,
    avatar: profileMap[user.id]?.avatar || null,
    bio: profileMap[user.id]?.bio || ''
   }));

   const lastUser = users[users.length  -1];
   const nextCursor = users.length === itemsPerPage ? lastUser.id : null;

   res.status(200).json({success: true, data, nextCursor});

})