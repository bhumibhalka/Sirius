import mongoose from "mongoose";

const followSchema = new mongoose.model({},{timestamps: true});

const Follow = mongoose.model('Follow', followSchema);
export default Follow;