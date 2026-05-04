import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  content: {
   type: String ,
   required: true,
   trim: true,
   maxlength: 1000,
  },
  /** 
   * FOR REPLIES: 
   * If this is null, it's a top-level comment.
   * If it contains an ID, it's a reply to that specific comment.
   */
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
    index: true,
  },
  // Simple stats for the comment itself
  stats: {
    likeCount: {type:Number, default: 0},
    replyCount: {type: Number, default: 0},
  }
},{timestamps: true})

commentSchema.index({postId: 1, parentId: 1, createdAt: -1})

const Comment  = mongoose.model('Comment', commentSlice);
export default Comment;