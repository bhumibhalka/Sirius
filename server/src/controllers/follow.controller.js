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

  const exisitingFollow = await Follow.findOne({followerId, followingId: targetUserId});

  if(exisitingFollow){ 
    await Follow.deleteOne({_id: exisitingFollow._id});

    await Promise.all([
      Profile.updateOne({accountId: followerId}, {$inc: {"stats.following": -1}}),
      Profile.updateOne({accountId: targetUserId}, {$inc: {"stats.followers": -1}})
    ])

    console.log("FOLLOWER UPDATE:", followerResult);
console.log("TARGET UPDATE:", targetResult);

   return res.status(200).json({
      success: true,
      isFollowing: false,
    })
  }else{

  await Follow.create({followerId, followingId: targetUserId})

  await Promise.all([
    Profile.updateOne({accountId: followerId}, {$inc: {'stats.following': 1}}),
    Profile.updateOne({accountId: targetUserId}, {$inc: {'stats.followers': 1}})
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

})