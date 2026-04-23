import mongoose from "mongoose";
import { STRING } from "sequelize";

const profileScehma = new mongoose.Schema({
  user :{
    //The Foreign Key from PostgreSQL User.id
    type:String,//  Linked to User UUID
    required: true,
    index: true,// Crucial for joining Auth and Social data
    unique: true,
  },
  displayName: {
    type:String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type:String,
    default: "https://cdn.example.com/assets/default-avatar.png"
  },
  coverImage: {
    type:String,
  },
  bio: {
    type:String,
    maxLength: [250, "Bio cannot contain more than 250 characters"],
    trim: true,
  },
  // Social status
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isVerified :{
    type:Boolean,
    default: false,
  },
  // Engagement Metrics (Denormalized for Performance)
  // We update these via background workers, not by counting the DB on every load
  stats: {
    followers: {type:Number, default: 0},
    following: {type:Number, deafult: 0},
    posts: {type: Number, default: 0},
    engagementRate: {type:Number, default: 0},
  },
  // Advanced AI & Personalization Data
  interests: [{
    type:String,
    index: true,//HELPS AI RECOMMENDATION ENGINE FILTER FEEDS
  }],
  preferences: {
    language: {type: String, deafult: 'en'},
    theme: {type:String, enum:['light', 'dark','system'], deafult: 'system'}
  },
  // Links to other domains (Gamification & Fintech)
  loyaltyTier :{
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    deafult: 'bronze',
  },
  socialLinks: {
    website: STRING,
    twitter: String,
    portfolio: String,
  },
},{
  timestamps: true,
  // Ensure virtuals are included when sending to frontend
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
})

// Text index for the Search Engine (Enables finding users by name/bio)
profileScehma.index({displayName: 'text', bio:'text'})

// Virtual for the profile URL
profileScehma.virtual('profileUrl').get(function(){
  return `/u/${this.displayName.toLowerCase()}`;
});

const Profile = mongoose.model("Profile", profileScehma);
export default Profile;