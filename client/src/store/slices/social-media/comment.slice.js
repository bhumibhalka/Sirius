import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";
import {decrementCommetCount, incrementCommentCount} from "./post.slice"
// import {addCommentOptimistic} from './comment.slice'

// export const createComment = createAsyncThunk("addComment", async({postId, content, parentId}, {rejectWithValue}) => {

  

//   try {
//     const res = await axiosInstance.post('/comment/create-comment',{postId,content, parentId});
//     toast.success('Comment added')
//     return res?.data?.data;
//   } catch (error) {
//     toast.error(error?.response?.data || 'Failed to post comment')
//     return rejectWithValue(error?.response?.data)
//   }
// })

export const createComment = createAsyncThunk("addComment", async({postId, content, parentId}, thunkAPI) => {

  const state = thunkAPI.getState()
  const currentUser = state.profile.activeProfile;



  if(!content.trim()){
    toast.error('Comment cannot be empty')
    return thunkAPI.rejectWithValue({
      message: 'Comment cannot be empty'
    })
  }

  // optimistic Comment
  const optimisticComment = {
    _id: `temp-${Date.now()}`,
    content,
    parentId,
    createdAt: new Date().toISOString(),

    author: {
      _id: currentUser.accountId,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      // username: currentUser.username,
    },

    // stats: {
    //   likeCount: 0,
    //   replyCount: 0,
    // },
    
    isOptimistic: true,
  }


  thunkAPI.dispatch(
    addCommentOptimistic(optimisticComment)
  )

 thunkAPI.dispatch(
  incrementCommentCount({postId})
 )
  

  try {
    const res = await axiosInstance.post('/comment/create-comment',{postId,content, parentId});
    toast.success('Comment added')
    return {
      realComment: res?.data?.data,
      tempId: optimisticComment._id,
    }
  } catch (error) {

    thunkAPI.dispatch(
      decrementCommetCount({postId})
    )

    toast.error(error?.response?.data?.message || 'Failed to post comment')
    return thunkAPI.rejectWithValue({
      tempId: optimisticComment._id,
      message:error?.response?.data || 'Failed to post comment',
    })
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
    isSubmitting: false,
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
   const {realComment, tempId} = action.payload;
  
   const index = state.items.findIndex(
    c => c._id === tempId,
   )

   if(index !== -1) {
    state.items[index] = {
      ...state.items[index],
      ...realComment,
      isOptimistic: false,
    };
   }

   state.isSubmitting = false;
  }
  )
  .addCase(createComment.rejected, (state, action) => {
    const tempId = action.payload?.tempId ;

    state.items = state.items.filter(
      (c) => c._id !== tempId
    );

    state.isSubmitting = false;

  })
  .addCase(createComment.pending, (state)=> {
    state.isSubmitting = true;
  })
  .addCase(fetchComments.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchComments.fulfilled, (state, action) => {
    state.loading = false;
   
    if(action.meta.arg.cursor){
     
      const existingIds = new Set(
        state.items.map(item => item._id)
      )

      const newComments = action.payload.data.filter(
       item  => !existingIds.has(item._id)
      )

      state.items = [...state.items, ...newComments]
    }else{
      state.items = action.payload.data
    }

    state.nextCursor = action.payload?.nextCursor;
  })
  }
})

export const {addCommentOptimistic, clearComments, resetComments} = commentSlice.actions;


export default commentSlice.reducer;