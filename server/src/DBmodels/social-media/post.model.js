import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  authorId: {
    type: String,
    index: true,
    required: true,
  },
  caption:{
    type:String,
    trim: true,
    maxlength: 2200,
    // default: ''
  },
  media:[{
    type:{type:String, enum:['images', 'videos'], default:'images'},
    public_id: {type:String, required: true},
    url: {type:String, required: true},
    thumbnail: String,
    aspectRatio: String // e.g., "16:9" - helps frontend prevent layout shift
  }],
  // Super App Feature: Tagged Products (Marketplace Integration)
  taggedProducts: [{
    productId: {type:mongoose.Schema.Types.ObjectId, ref: 'Product'},
    coordinates: {x: Number, y:Number}// Position of the tag on the image
  }],
  location: {
    type: {type:String, default: 'Point'},
    cooridantes: {type: [Number], index: '2dsphere'},
    name: String //e.g, "Paris, France"
  },
  // Performance Metrics (Denormalized)
  stats: {
    likeCount: {type:Number, default: 0},
    commentCount: {type:Number, default: 0},
    shareCount: {type: Number, default: 0},
    viewCount: {type: Number, default:0}
  },
  //Privacy & Reach
  visibility: {
    type:String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  isArchived: {type: Boolean, default: false},
},{
  timestamps:true,
  toJSON:{ virtuals: true}
}
)

// COMPOUND INDEX: Crucial for "Feed" performance
// This allows: Find posts by this user, sorted by
postSchema.index({authorId: 1, createdAt: -1});
// TEXT INDEX: For keyword searching in the feed
postSchema.index({caption: 'text'})

const Post = mongoose.model('Post', postSchema);
export default Post;