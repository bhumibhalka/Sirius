import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({},{timestamps: true});

const Like = mongoose.model('Like', likeSchema)
export default Like;