import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

export const getProfile = createAsyncThunk("getProfile", async(username, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/profile/${username}`);
    return res?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to load the profile');
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})


export const toggleFollow = createAsyncThunk("toggleFollow", async(targetUserId, rejectWithValue)=>{
  try {
    const res = await axiosInstance.post(`/profile/${targetUserId}`);
    toast.success('User followed')
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to follow user');
    return rejectWithValue(error?.response?.data?.message)
  }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    activeProfile: null,
    loading: false,
    error: null,
    isFollowing :false,
  },
  reducers: {
    // Update relationship status locally if user clicks "Follow"
    // updateFollowStatus: (state, action) => {
    //   if(state.activeProfile) {
    //     state.activeProfile.relationship.isFollowing = action.payload;
    //     state.activeProfile.stats.followers += action.payload ? 1 : -1;
    //   }
    // },
    optimisticFollowToggle: (state, action) => {
      const {isFollowing} = action.payload;
      if(state.activeProfile) {
        state.activeProfile.relationship.isFollowing = isFollowing;
        //update stats locally
        state.activeProfile.stats.followers += isFollowing ? 1 : -1
      }
    }
  },
  extraReducers: (builder) => {
   builder
   .addCase(getProfile.pending, (state) => {
    state.loading = true;
   })
   .addCase(getProfile.fulfilled, (state, action)=> {
    state.loading = false;
    state.activeProfile = action.payload
   })
   .addCase(getProfile.rejected, (state)=> {
    state.loading = false;
   })
   .addCase(toggleFollow.fulfilled, (state, action)=> {
    state.isFollowing = action.payload?.isFollowing;
   })
   .addCase(toggleFollow.rejected, (state, action) => {
     if(state.activeProfile) {
      const failedAttemptWasFollow = !state.activeProfile.relationship.isFollowing;
      state.activeProfile.relationship.isFollowing = !state.activeProfile.relationship.isFollowing;
      state.activeProfile.stats.followers += failedAttemptWasFollow ? -1 : 1;
     }
     state.error = action.payload?.message || 'Follow action failed';
   })
  }
})

export const {optimisticFollowToggle} = profileSlice.actions;
export default profileSlice.reducer;