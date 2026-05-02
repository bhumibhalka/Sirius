import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  // The person clicking "Follow"
  followerId: {
    type:String,
    required: true,
    index: true,
  },
  followingId: {
    type:String,
    required: true,
    index: true,
  },

},{timestamps: true});

followSchema.index({followerId: 1, followingId: 1});

const Follow = mongoose.model('Follow', followSchema);
export default Follow;