import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

export const toggleSavePost = createAsyncThunk("toggleSavePost", async(postId, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/save/post-save/${postId}`);
    return {postId, isSaved: res?.data?.isSaved};
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to save post');
    return thunkAPI.rejectWithValue(error?.response?.data)
  }
})

export const fetchSavedPost = createAsyncThunk("fetchSavedPost", async({cursor}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(`/save//all-saved/post?cursor=${cursor}`);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to fetch saved posts')
    return rejectWithValue(error?.response?.data)
  }
})

const saveSlice = createSlice({
  name: 'save',
  initialState: {
    library: [],
    loading: false,
    nextCursor: null,
    error: false,
  },
  reducers: {
    // Optimistic reducer to update feed state immediately
    // Note: Usually, 'isSaved' status is part of the post object in feedSlice
    updateSavedStatus: (state,action) => {
      const {postId, isSaved} = action.payload;

      if(!isSaved) {
        state.library = state.library.filter(p => p._id !== postId)
      }
    }
  },
  extraReducers: (builder) => {
   builder
   .addCase(toggleSavePost.rejected, (state, action) => {
    state.error = action.payload?.message || "Failed to save post";
   })
   .addCase(fetchSavedPost.pending, (state) => {
    state.loading = true;
   })
   .addCase(fetchSavedPost.fulfilled, (state, action) => {
    state.loading = false;
    state.library = action.meta.arg.cursor //if this request was made with cursor then do this add more data to the already exiting one
    ? [...state.library, ...action.payload.data]
    : action.payload.data;
    state.nextCursor = action.payload.nextCursor;
   })
  }
})

export const { updateSavedStatus } = saveSlice.actions;

export default saveSlice.reducer;