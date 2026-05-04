import Profile from "../DBmodels/profile.model.js";
import Comment from "../DBmodels/social-media/comment.model.js";
import Like from "../DBmodels/social-media/like.model.js";
import Post from "../DBmodels/social-media/post.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.js";
import {Op} from 'sequelize';

export const getUsers = asyncHandler(async(req,res,next)=> {
   console.log("GET USERS HIT");
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


   const userIds = users.map(u => String(u.id));
   const profiles = await Profile.find({accountId: {$in: userIds} })
   .select('accountId displayName avatar bio stats')
   .lean();

   // 🔥 ADD THIS
console.log("USER IDS:", userIds);

console.log("RAW PROFILES:", JSON.stringify(profiles, null, 2));

profiles.forEach(p => {
  console.log("PROFILE:", p.accountId, "followers:", p?.stats?.followers);
});

users.forEach(u => {
  console.log("USER:", u.id);
});
// 🔥 END

   const profileMap = profiles.reduce((acc, p) => ({...acc, [String(p.accountId)]: p}), {})


   const data = users.map(user => ({
    id: user.id,
    username: user.username,
    displayName: profileMap[String(user.id)]?.displayName || user.username,
    avatar: profileMap[String(user.id)]?.avatar || null,
    followers: profileMap[String(user.id)]?.stats?.followers ?? 0,
    bio: profileMap[String(user.id)]?.bio || ''
   }));

   const lastUser = users[users.length  -1];
   const nextCursor = users.length === itemsPerPage ? lastUser.id : null;

   res.status(200).json({success: true, data, nextCursor});

})

// export const toggleLike = asyncHandler(async(req,res,next)=> {
//   const {postId} = req.params;
//   const userId = req.user.id;

//   const existingLike = await Like.findOne({postId, userId});

//   if(existingLike) {
//     await Like.deleteOne({_id: existingLike._id});

//     await Post.updateOne({_id: postId}, {$inc: {'stats.likeCount' : -1}});

//     return res.status(200).json({
//       success: true,
//       isLiked: false,
//     })
//   }else{ 

//     await Like.create({postId, userId});

//     const post = await Post.findOneAndUpdate(
//       {_id: postId},
//       {$inc: {'stats.likeCount': 1}},
//       {new: true}
//     )
  

//   res

//   }
// })

export const toggleLike = asyncHandler(async(req,res,next) => {
  const {postId} = req.params;
  const userId = req.user.id;

  const existingLike = await Like.findOne({userId, postId});

  if(existingLike) {
    await Like.deleteOne({_id: existingLike._id});

    await Post.updateOne({_id: postId}, {$inc: {'stats.likeCount': -1}});
    
    return res.status(200).json({success: true, isLiked: false,postId})
  }else{
    await Like.create({postId, userId});

    const post = await Post.findOneAndUpdate(
      {_id: postId},
      {$inc : {'stats.likeCount': 1}},
      {new: true},
    )

    return res.status(201).json({
      success: true,
      isLiked: true,
      postId
    })
  }
})

export const createComment = asyncHandler(async(req,res,next)=> {
  const {postId, content, parentId = null} = req.params;
  const authorId = req.user.id;

  const comment = await Comment.create({
    postId,
    authorId,
    content,
    parentId,
  });

  if(parentId) {
    // If it's a reply, update parent comment's reply count
    await Comment.findByIdAndUpdate(parentId, {$inc: {'stats.replyCount' : 1}})
  }else{
    await Post.findByIdAndUpdate(postId, { $inc: {'stats.commentCount': 1}});
  }

  res.status(201).json({success: true, data: comment})
})

export const getComments = asyncHandler(async(req,res,next) => {
  const { postId } = req.params;
  const {cursor, parentId = null} = req.query;
  const authorId = req.user.id;

  const query = {postId, parentId};
  if(cursor) query.createdAt = {$lt: new Date(cursor)}

  const comments = await Comment.find(query)
  .sort({createdAt: -1})
  .limit(10)
  .lean();

 res.status(200).json({
  success: true,
  data: hydratedComments
 })

})