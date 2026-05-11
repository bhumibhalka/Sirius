import Profile from "../DBmodels/profile.model.js";
import Follow from "../DBmodels/social-media/Follow.model.js";
import Like from "../DBmodels/social-media/like.model.js";
import Post from "../DBmodels/social-media/post.model.js";
import Save from "../DBmodels/social-media/save.model.js";
import cloudinary from "../lib/cloudinary.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import User from "../models/user.js";

export const createPost = asyncHandler(async(req,res,next)=> {
  const {caption} = req.body;
  const userId = req.user.id;
//   console.log("FILES:", req.files);
// console.log("BODY:", req.body);
  if(!req.files || !req.files.media){

    return next(new ErrorHandler('images or video is required to create a post',400))
  }

  const files = Array.isArray(req.files.media) 
  ? req.files.media 
  : [req.files.media]

  
  const uploadMedia = await Promise.all(
    files.map(async(file) => {
      const isVideo = file.mimetype.startsWith("video")
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "post_images",
        resource_type : isVideo ? "video" : "image"
      })

      return {
        type: isVideo ? "videos" : "images",
        public_id: result.public_id,
        url: result.secure_url,
         thumbnail: isVideo
        ? result.secure_url.replace(".mp4", ".jpg") // simple thumbnail trick
         : null,
      }
    })
  )

  const post = await Post.create({
   authorId: userId,
   media: uploadMedia,
   caption,
  })

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post
  })

})

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);

  if (diff < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export const fetchHomeFeed = asyncHandler(async(req,res,next)=> {
  const userId = req.user.id;
  const { cursor, limit} = req.query;
  const { username }= req.params;
  const limitNumber = Number(limit) || 10;

  const user = await User.findOne({
    where: {username}
  })

  if(!user){
    return next(new ErrorHandler('User not found', 404))
  }

  const query = {isArchived: false};
  // if(cursor) query.createdAt = {$lt: new Date(cursor)}
  if (cursor) {
    const date = new Date(cursor);
    if (!isNaN(date.getTime())) {
      query.createdAt = { $lt: date };
    }
  }


  const posts = await Post.find(query)
  .sort({createdAt: -1})
  .limit(limitNumber)
  .lean();

  if(posts.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],

    })
  }


  const postIds = posts.map(p => p._id);
  const authorIds = [...new Set(posts.map(p => p.authorId))]
  const userSaves = await Save.find({
    userId: req.user.id,
    postId: {$in: postIds}
  }).select('postId')

  const savedSet = new Set(userSaves.map(s => s.postId.toString()))

  console.log("userSaves:", userSaves);
console.log("savedSet:", savedSet);
console.log("postIds:", postIds);

const [profiles, users,userLikes, followingList] = await Promise.all([
  Profile.find({accountId: {$in: authorIds}}).select('accountId displayName avatar').lean(),

  User.findAll({
    where: {
      id:authorIds
    },
    attributes: ['id', 'username'],
    raw: true,
  }),
  Like.find({userId, postId: {$in: postIds}}).select('postId').lean(),
  Follow.find({followerId: userId, followingId: {$in: authorIds}}).select('followingId').lean()
])

const followingSet = new Set(followingList.map(f => f.followingId.toString()));
  const profileMap = profiles.reduce((acc, p) => ({...acc, [p.accountId] : p }), {});
  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  },{})
  const likedMap = new Set(userLikes.map(l => l.postId.toString()));
  // const savedMap = new Set(); // temporary
  // const savedMap = new Set(userSaves.map(s => s.postId.toString()));

  const hydratedFeed = posts.map(post => ({
    ...post,
    author: {...(profileMap[post.authorId] || {}), 
  username: userMap[post.authorId]?.username || null},
    likedByMe: likedMap.has(post._id.toString()),
    isSaved: savedSet.has(post._id.toString()),
    timeAgo: formatTimeAgo(post.createdAt),
  }))

    const nextCursor =
    posts.length === limitNumber // ❌ CHANGED (was using string limit)
      ? posts[posts.length - 1].createdAt
      : null;

  return res.status(200).json({
    success: true,
    nextCursor,
    data: hydratedFeed,
    followingSet: [...followingSet]
  })
  
})

export const getUserPosts = asyncHandler(async(req,res,next) => {
  const {cursor , limit = 10} = req.query;
  const authorId = req.user.id;

  const query = {
    authorId,
    isArchived : false
  };
   if(cursor){
    query.createdAt = {$lt : new Date(cursor)}
   }

   const posts = await Post.find(query)
   .select('media stats createdAt visibility')
   .sort({createdAt: -1})
   .limit(Number(limit))
   .lean()
   
   const nextCursor = posts.length === Number(limit) ? posts[posts.length - 1].createdAt : null;

   res.status(200).json({
    success: true,
    count: posts.length,
    nextCursor,
    data: posts,
   })
   
})

export const getPosts = asyncHandler(async(req,res,next)=> {
  const {cursor, limit = 12 } = req.query;
  const userId = req.user.id;

  const query = {isArchived: false};
  //  const limitNumber = Number(limit) || 12
  if(cursor) {
    query.createdAt = {$lt: new Date(cursor)}
  }

  const posts = await Post.find(query)
  .sort({createdAt: -1})
  .limit(Number(limit))
  .lean();

  if(!posts.length) {
    return res.status(200).json({success: true, data: [], nextCursor: null})
  }

  // 3. Hydrate Data (Parallel Execution)
  const postIds = posts.map(p => p._id);
  const authorIds = [...new Set(posts.map((p) => p.authorId))]

  const [profiles, userLikes] = await Promise.all([
    Profile.find({accountId: {$in : authorIds}}).select('accountId displayName avatar ').lean(),

    Like.find({userId, postId: {$in: postIds}}).select('postId').lean()
  ])

  // 4. Map everything together for the UI
  const profileMap = profiles.reduce((acc, p) => ({...acc, [p.accountId] : p}), {})
  const likedSet = new Set(userLikes.map((l) => l.postId.toString()));


  const hydratedPosts = posts.map(post => ({
    ...post,
    author: profileMap[post.authorId] || {display: 'Deleted User', avatar: null},
    likedByMe: likedSet.has(post._id.toString()) 
  }))

  const nextCursor = posts.length === Number(limit) ? posts[posts.length - 1].createdAt : null;

  res.status(200).json({
    success: true,
    nextCursor,
    data: hydratedPosts
  })

})

export const getPost = asyncHandler(async(req,res,next)=> {
  const {postId} = req.params;
  const userId = req.user.id;

  const post = await Post.find()
  .sort({createdAt: -1})
  .lean();



})