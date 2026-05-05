import Post from "../DBmodels/social-media/post.model.js";
import Save from "../DBmodels/social-media/save.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";


export const toggleSavePost = asyncHandler(async(req,res,next) => {
  const {postId} = req.params;
  const userId = req.user.id;

  const postExists = await Post.exists({_id: postId});
  if(!postExists){
    await next(new ErrorHandler('Post not found',404))
  }

  const existingSave = await Save.findOne({userId, postId});
  if(existingSave){
    await Save.deleteOne({_id: existingSave._id});
    return res.sttaus(200).json({success: true, isSaved: false});
  }else{
    await Save.create({userId, postId});
    return res.status(201).json({success: true, isSaved: true})
  }
})

export const getSavedPosts = asyncHandler(async(req,res,next) => {
  const {cursor, limit = 10} = req.query;
  const userId = req.user.id;

  const query = {userId};
  if(cursor) {
    query.createdAt = {$lt : new Date(cursor)}
  }

  const savedItems = await Save.find(query)
  .sort({createdAt: -1})
  .limit(Number(limit))
  .populate({
    path: 'postId',
    select: 'content media stats authorId  createdAt'
  }).lean();

  const data = savedItems
  .filter( item => item.postId)
  .map(item => ({
    ...item.postId,
    savedAt: item.createdAt
  }))
  
  const nextCursor = savedItems.length === Number(limit) 
  ? savedItems[savedItems.length - 1].createdAt 
  : null;

  res.status(200).jsom({success: true, data, nextCursor})

})

// export const toggleSave = asyncHandler(async(req,res,next) => {
//    const {postId} = req.params;
//    const userId = req.user.id;

//    const postExists = await Post.exists({_id: postId});
//    if(!postExists) {
//     return next(new ErrorHandler('Post not found', 404))
//    }


//    const existingSave = await Save.findOne({ userId, postId })
    
//    if(existingSave) {
//     await Save.deleteOne({_id: existingSave._id });
  
//     res.status(200).json({success: true, isSaved: false})
//     // await Post.updateOne({_id: postId}, {$inc: {'stats.saved'}})
//    }else {
//     await Save.create({userId, postId})
//      res.status(201).json({success: true, isSaved: true})
//    }
   
// })