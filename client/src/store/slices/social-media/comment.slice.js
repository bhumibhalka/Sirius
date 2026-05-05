import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

export const createComment = createAsyncThunk("addComment", async({postId, content, parentId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post('/comment/create-comment',{postId,content, parentId});
    toast.success('Comment added')
    return res?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to post comment')
    return rejectWithValue(error?.response?.data)
  }
})

export const fetchComments = createAsyncThunk("fetchComments", async({postId, cursor}, {rejectWithValue})=> {
  try {
    const res = await axiosInstance.get(`/comment/comments/${postId}?cursor=${cursor || ''}`);
    return res?.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data)
  }
})

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    items: [],
    loading : false,
    nextCursor: null,
    replyLoading : {},
    error: null,
  },
  reducers: {
    addCommentOptimistic: (state, action) => {
      state.items.unshift(action.payload);// Adds new comment to top of array
    },
    clearComments: (state) => {
    state.items = [];
    },
    resetComments: (state) => {
      state.items = [];
      state.nextCursor = null;
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
  .addCase(fetchComments.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchComments.fulfilled, (state, action) => {
    state.loading = false;
    // Append if cursor exists, else replace (for fresh load)
    state.items = action.meta.arg.cursor
    ? [...state.items, ...action.payload.data]
    : action.payload.data;
    state.nextCursor = action.payload?.nextCursor;
  })
  }
})

export default commentSlice.reducer;