import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

export const createComment = createAsyncThunk("addComment", async({postId, content, parentId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post('/user/comment',{postId,content, parentId});
    return res?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to post comment')
    return rejectWithValue(error?.response?.data)
  }
})


const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    items: [],
    loading : false,
  },
  reducers: {
    addCommentOptimistic: (state, action) => {
      state.items.unshift(action.payload);// Adds new comment to top of array
    },
    clearComments: (state) => {
    state.items = [];
    }
  },
  extraReducers: (builder) => {
   builder
   .addCase(createComment.fulfilled, (state, action) => {
    const newComment = action.payload;
    const {parentId} = newComment;

    if(!parentId) {
      state.items.unshift(newComment);
    }else{
      const parentComment = state.items.find(c => c._id === parentId);
      if(parentComment){
      
      if(!parentComment.replies) parentComment.replies = [];

      parentComment.replies.push(newComment);
      parentComment.stats.replyCount += 1;
    }}
    state.isSubmitting = false;
  }
  )
  .addCase(createComment.pending, (state)=> {
    state.isSubmitting = true;
  })
  }
})

export default commentSlice.reducer;