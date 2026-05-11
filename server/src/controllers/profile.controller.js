import Profile from "../DBmodels/profile.model.js";
import Follow from "../DBmodels/social-media/Follow.model.js";
import Post from "../DBmodels/social-media/post.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import User from "../models/user.js";

export const getProfile = asyncHandler(async(req,res,next) => {
  const {username} = req.params;
  const currentUserId = req.user.id;

  console.log("GET PROFILE CONTROLLER HIT");

  const userAuth = await User.findOne({
    where: {username},
    attributes: ['id', 'username', 'role', 'createdAt']
  });
  if(!userAuth){
    return next(new ErrorHandler('Profile not found',404))
  }

  // console.log("Sequelize ID:", userAuth.id, typeof userAuth.id);
  // console.log("Found user:", userAuth);
  const targetUserId = String(userAuth.id); 

  const [profile, followersCount, followingCount, postsCount , isFollowing] = await Promise.all([
    Profile.findOne({accountId: targetUserId}).lean(),
    Follow.countDocuments({followingId: targetUserId}),
    Follow.countDocuments({followerId: targetUserId}),
    Post.countDocuments({authorId: targetUserId, isArchived: false}),
    Follow.exists({followerId: currentUserId, followingId: targetUserId})
  ])

  res.status(200).json({
    success: true,
    data: {
      ...userAuth.toJSON(),
      ...profile,
      stats: {
        followers: followersCount,
        following: followingCount,
        posts: postsCount,
      },
      relationship: {
        isFollowing: !!isFollowing,
        isSelf: currentUserId === targetUserId
      }
    },
  })
})

// export const updatedProfile = asyncHandler(async(req,res,next)=> {
//   const {username, displayName, bio ,avatar, location} = req.body;
//   const userId = req.user.id;

//   if(username){
//     const exisitingUser = await User.findOne({where: {username}});
//     if(exisitingUser && exisitingUser.id !== userId){
//       return res.status(400).json({
//         success: true,
//         message : 'Username already taken'
//       })
//     }
//     await User.update({username}, {where: {id: userId}})
//   }

//   const updatedProfile = await Profile.findOneAndUpdate(
//     {accountId: userId},
//     {
//       $set: {
//       displayName,
//       avatar,
//       bio,
//       location,
//       lastUpdated: Date.now(),
//     }},
//     {new: true, runValidators: true}
//   )

//   res.status(200).json({
//     success: true,
//     data: {
//       username,
//       ...updatedProfile._doc
//     }
//   })
// })


export const updateProfile = asyncHandler(async(req,res,next) => {
  const {username, displayName, bio, avatar, location} = req.body;
  const userId = req.user.id;

  if(username){
    const existingUser = await User.findOne({ where: {username} });
    if(existingUser && existingUser.id !== userId){
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      })
    }
    await User.update({username}, {where: {id: userId}});
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    {accountId: userId},
    {
      $set:{ 
        displayName,
        bio,
        avatar,
        location,
        lastUpdated: Date.now()
      }
    },
    {new: true, runValidators: true}
  );

  res.status(200).json({
    success: true,
    data: {
      username,
      ...updatedProfile._doc
    }
  })


})