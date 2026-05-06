import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";
import { toggleSavePost } from "./save.slice";

export const createPost = createAsyncThunk("createPost", async(data,thunkAPI) => {
  try {
    const res = await axiosInstance.post('/post/create-post', data);
    toast.success(res?.data?.message || 'Post created successfully');
    return res?.data?.post;
  } catch (error) {
     console.log("ERROR FULL:", error); // 👈 IMPORTANT
    console.log("ERROR DATA:", error?.response?.data);
    toast.error(error?.response?.data?.message || 'Failed to create post')
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
})

export const fetchHomeFeed = createAsyncThunk("post/all-posts", async({cursor}, thunkAPI) => {
  try {
    const url = cursor
        ? `/post/all-posts?cursor=${cursor}`
        : `/post/all-posts`;
    const res = await axiosInstance.get(url);
    // console.log(res?.data?.posts);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch posts')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

export const getUserPosts = createAsyncThunk("post/user/posts", async(cursor, thunkAPI) => {
  try {

    const url = cursor ? 
    `/post/user/posts?cursor=${cursor}`
    : '/post/user/posts'
    const res = await axiosInstance.get(url);
    return res?.data;
  } catch (error) {
     toast.error(error?.response?.data?.message || 'Failed to fetch user posts');
     return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

// export const getPosts = createAsyncThunk("post/all-posts", async(cursor, thunkAPI) => {
//   try {
//     const res = await axiosInstance.get(`/post/all-posts?cursor=${cursor || ''}`);
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message || 'Failed to fetch posts')
//     return thunkAPI.rejectWithValue(error?.response?.data?.message);
//   }
// })

export const fetchAllPosts = createAsyncThunk('post/all/posts', async(cursor, thunkAPI)=>{
  try {
    const res = await axiosInstance.get(`/post/all-posts?cursor=${cursor || ''}`);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch posts')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

export const toggleLike = createAsyncThunk("toggleLike", async({postId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post(`/user/like/${postId}`);
    toast.success(res?.data?.isLiked ? "Post is liked" : "Post is unliked");
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to like post');
    return rejectWithValue(error?.response?.data)
  }
})


const postSlice = createSlice({
  name: 'post',
  initialState: {
    loading : false,
    posts: [],
    nextCursor: null,
    error: null,
    isRefreshing: false,
    status: 'idle',
    comments: [],
  },
  reducers: {
    // Optimistic UI Update: Heart turns red immediately when clicked
    toggleLikeOptimistic: (state, action) => {
      const {postId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if(post){
        post.likedByMe = !post.likedByMe;
        post.stats.likeCount += post.likedByMe ? 1 : -1 ;
      }
    },
    // Optimistic UI Update: Bookmark toggle
    toggleSaveOptimistic: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if(post){
        post.saveByMe = !post.saveByMe;
      }
    },
    clearFeed: (state) => {
      state.posts = [];
      state.nextCursor = null;
    },
    resetProfilePosts: (state) => {
      state.posts = [],
      state.nextCursor = null;
    },
    likeToggleOptimistic: (state, action) => {
      const {postId} = action.payload;
      const post = state.posts.find((p) => p._id === postId);

      if(post) {
        post.likedByMe = !post.likedByMe;

        post.stats.likeCount += post.likedByMe ? 1 : -1
      }
    }

  },
  extraReducers: (builder) => {
   builder
   .addCase(createPost.pending, (state)=> {
    state.loading = true;
   })
   .addCase(createPost.fulfilled, (state, action)=> {
    state.loading = false;
    state.posts.unshift(action.payload); //newest on top
   })
   .addCase(createPost.rejected, (state)=> {
    state.loading = false;
   })
   .addCase(fetchHomeFeed.pending, (state)=> {
    state.loading = 'loading';
   })
   .addCase(fetchHomeFeed.fulfilled, (state, action) => {
    state.loading = 'succeeded';
      const newPosts = action.payload.data; // ✅ ADDED

  const existingIds = new Set(state.posts.map(p => p._id)); // ✅ ADDED

  const filteredPosts = newPosts.filter(
    p => !existingIds.has(p._id)
  ); 
    state.posts = [...state.posts, ...filteredPosts]; 
    state.nextCursor = action.payload.nextCursor;
   })
   .addCase(fetchHomeFeed.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message;
   })
   .addCase(getUserPosts.pending, (state) => {
    state.loading = true;
   })
   .addCase(getUserPosts.fulfilled, (state, action) => {
    state.loading = false;
    state.posts = [...state.posts, ...action.payload.data];
    state.nextCursor = action.payload.nextCursor;
   })
   .addCase(getUserPosts.rejected, (state) => {
    state.loading = false;
   })
  //  .addCase(getPosts.pending, (state) => {
  //   state.loading = true;
  //  })
  //  .addCase(getPosts.fulfilled, (state, action) => {
  //   state.loading = false;
  //   state.posts = [...state.posts, ...action.payload.data];
  //   state.nextCursor = action.payload?.nextCursor;
  //  })
  //  .addCase(getPosts.rejected, (state) => {
  //   state.loading = false;
  //  })
   .addCase(fetchAllPosts.pending , (state)=> {
    state.loading = true;
   })
   .addCase(fetchAllPosts.fulfilled, (state, action)=> {
    state.loading = false;
    // state.posts = [...state.posts, ...action.payload.data];
    state.posts = action.payload?.data;
    state.nextCursor = action.payload?.nextCursor;
   })
   .addCase(fetchAllPosts.rejected, (state)=> {
    state.loading = false;
   })
   .addCase(toggleLike.rejected, (state, action) => {
    const {postId} = action.payload;
    const post = state.posts.find((p)=> p._id === postId);

    if(post) {
      post.likedByMe = !post.likedByMe;
      post.stats.likeCount += post.likedByMe ? 1 : -1;
      console.error("Like failed, rolling back UI");
    }
   })
  //  .addCase(toggleSavePost.fulfilled, (state, action) => {
  //   const {postId, isSaved} = action.payload;

  //     const post = state.posts.find(p => p._id === postId);
  //     if (post) {
  //       post.isSaved = isSaved;
  //     }
  //  })
  }
})

export const {toggleLikeOptimistic, toggleSaveOptimistic, clearFeed, resetProfilePosts, likeToggleOptimistic} = postSlice.actions

export default postSlice.reducer