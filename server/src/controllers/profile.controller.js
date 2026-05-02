import Profile from "../DBmodels/profile.model.js";
import Follow from "../DBmodels/social-media/Follow.model.js";
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

  const [profile, followersCount, followingCount, isFollowing] = await Promise.all([
    Profile.findOne({accountId: targetUserId}).lean(),
    Follow.countDocuments({followingId: targetUserId}),
    Follow.countDocuments({followerId: targetUserId}),
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
      },
      relationship: {
        isFollowing: !!isFollowing,
        isSelf: currentUserId === targetUserId
      }
    },
  })
})

export const myProfile = asyncHandler(async(req,res,next) => {

})