import Profile from "../DBmodels/profile.model.js";
import Follow from "../DBmodels/social-media/Follow.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";

export const getProfile = asyncHandler(async(req,res,next) => {
  const username = req.params;
  const currentUserId = req.user.id;

  const userAuth = await User.findOne({
    where: {username},
    attributes: ['id', 'username', 'role', 'createdAt']
  });
  if(!userAuth){
    return next(new ErrorHandler('Profile not found',404))
  }

  const tragetUserId = userAuth.id;

  const [profile, followersCount, followingCount, isFollowing] = await Promise.all([
    Profile.findOne({accountId: tragetUserId}).lean(),
    Follow.countDocuments({followingId: tragetUserId}),
    Follow.countDocuments({followerId: tragetUserId}),
    Follow.exists({followerId: currentUserId, followingId: tragetUserId})
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
        isSelf: currentUserId === tragetUserId
      }
    },
  })
})

export const myProfile = asyncHandler(async(req,res,next) => {

})