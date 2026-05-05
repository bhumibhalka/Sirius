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

const saveSlice = createSlice({
  name: 'save',
  initialState: {
    library: [],
    loading: false,
    nextCursor: null,
    error: false,
  },
  reducers: {
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
  }
})

export const { updateSavedStatus } = saveSlice.actions;

export default saveSlice.reducer;