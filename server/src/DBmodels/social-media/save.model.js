import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
  userId: {
  type:mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post',
    required: true,
  },
  folderName: {
    type:String,
    default: 'All'
  }

},{timestamps: true});

saveSchema.index({userId: 1, postId: 1}, {unique: true})

const Save = mongoose.model('Save', saveSchema);
export default saveSchema;