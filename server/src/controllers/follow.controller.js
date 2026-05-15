import Profile from "../DBmodels/profile.model.js";
import Follow from "../DBmodels/social-media/Follow.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { createNotification } from "./notification.controller.js";

// export const followUser = asyncHandler(async(req,res,next)=> {
//   const followerId = req.user.id;
//   const {targetUserId} = req.params;


//   if(followerId === targetUserId) {
//     return next(new ErrorHandler('You cannot follow yourself'));
//   }

//   const exisitingFollow = await Follow.findOne({followerId, followingId: targetUserId});

//   if(exisitingFollow) {
//     await Follow.deleteOne({_id: exisitingFollow._id})

//     //Atomically decrement counts

//     await Promise.all([
//       Profile.updateOne({accountId: followerId}, {$inc: {"stats.following": -1}}),
//       Profile.updateOne({accountId: targetUserId}, {$inc: {"stats.followers": -1}})
//     ])

//     return res.status(200).json({
//       success: true,
//       isFollowing: false,
//     })
//   }else{

//     await Follow.create({followerId, followingId: targetUserId})

//     await Promise.all([
//       Profile.updateOne({accountId: followerId}, {$inc:{ "stats.following": 1}}),
//       Profile.updateOne({accountId: targetUserId}, {$inc: {"stats.followers": 1}})
//     ])
//   }

//   await createNotification(
//     targetUserId,
//     followerId,
//     'FOLLOW',
//     null,
//     `${req.user.username} started following you`,
//     {path: `/profile/${req.user.username}`}
//   )

//   return res.status(201).json({
//     success: true,
//     isFollowing: true
//   })
// })


export const toggleFollow = asyncHandler(async(req,res,next)=> {
  const followerId = req.user.id;
  const {targetUserId} = req.params;

  if(followerId === targetUserId) {
    return next (new ErrorHandler('You cannot follow yourself',400))
  }

//   console.log("followerId type:", typeof followerId, "value:", followerId);
// console.log("targetUserId type:", typeof targetUserId, "value:", targetUserId);

console.log("Looking for accountId:", targetUserId);
const profile = await Profile.findOne({ accountId: targetUserId });
console.log("FOUND PROFILE:", profile);
 

  const exisitingFollow = await Follow.findOne({followerId, followingId: targetUserId});

  if(exisitingFollow){ 
    await Follow.deleteOne({_id: exisitingFollow._id});

  const [followerResult, targetResult] =  await Promise.all([
      Profile.updateOne({accountId: String(followerId)}, {$inc: {"stats.following": -1}}),
      Profile.updateOne({accountId:String(targetUserId)}, {$inc: {"stats.followers": -1}})
    ])

    console.log("FOLLOWER UPDATE:", followerResult);
console.log("TARGET UPDATE:", targetResult);

   return res.status(200).json({
      success: true,
      isFollowing: false,
      targetUserId
    })
  }else{

  await Follow.create({followerId, followingId: targetUserId})

  const [followerResult, targetResult] = await Promise.all([
    Profile.updateOne({accountId: String(followerId)}, {$inc: {'stats.following': 1}}),
    Profile.updateOne({accountId: String(targetUserId)}, {$inc: {'stats.followers': 1}})
  ])

  // await createNotification(
  //   targetUserId,
  //   followerId,
  //   'FOLLOW',
  //   null,
  //   `${req.user.username} started following you`,
  //   { path: `/profile/${req.user.username}`}
  // )

  return res.status(201).json({
    success: true,
    isFollowing: true,
     targetUserId 
  })
  }

});

export const getFollowData = asyncHandler(async(req,res,next)=> {
  const {type ,cursor, limit = 10} = req.query;
  const {userId} = req.params;

  const query = {};
  if( type === "followers") {
    query.followingId = userId; // poeple following this user
  }else{
    query.followerId = userId; 
  }
  

  if(cursor) query.createdAt = {$lt : new Date(cursor)}
 
  const follows = await Follow.find(query)
  .limit(Number(limit))
  .sort({createdAt: -1})
  .lean();

  console.log("FOLLOWS:", follows);

  const targetIds = follows.map((f) =>  type === 'followers' ? f.followerId : f.followingId
  )

  console.log("TARGET IDS:", targetIds);

  const profile  = await Profile.find({accountId: {$in : targetIds} })
  .select('displayName avatar bio accountId')
  .lean();

  console.log("PROFILES:", profile);
  const data = follows.map(f => {
    const id = type === 'followers' ? f.followerId : f.followingId;
    return {
      followId: f._id,
      followedId: f.createdAt,
      user: profile.find( p => String(p.accountId) === String(id)) || null
    }
  })

  console.log("DATA:", data);

  const nextCursor = data.length === Number(limit) ? data[data.length - 1].createdAt : null;

  res.status(200).json({
    success: true,
    data,
    nextCursor
  })


})

// export const getFollowers = asyncHandler(async(req,res,next) => {
//   const {cursor , limit = 10} = req.query;
//   const userId = req.user.id;

//   const query = {
//     $or : [
//       {followerId: userId},
//       {followingId: userId}
//     ]
//     };
//   if(cursor) query.createdAt = {$lt : new Date(cursor)}

//   const data = await Follow.find(query)
//   .limit(Number(limit))
//   .sort({createdAt: -1})
//   .lean();

//   const nextCursor = data.length === Number(limit) ? data[data.length -1] : null;

//   res.status(200).json({
//     success: true,
//     data,
//     nextCursor
//   })

// })
