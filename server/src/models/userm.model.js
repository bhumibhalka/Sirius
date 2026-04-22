import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required: true,
  },
  email: {
    type:String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    
  },
  password: {
    type:String,
    required: true,
    minlength: [8, "Password must at least contain 8 charcters"],
    maxlength: [40, "Password can not contain more than 40 charcters"]
  },
  profilePic:{
    public_id: {type:String},
    url: {type:String},
  },

  //Socail media
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
  followers: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  followersCount: {type:Number, default: 0},
  following: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  followingCount: {type:Number, default: 0},
  notifications : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  }],

  //E-commerece

  //Payments


}, {timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;