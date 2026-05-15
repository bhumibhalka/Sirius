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


export const toggleFollow = createAsyncThunk("toggleFollow", async(targetUserId, {rejectWithValue})=>{
  try {
    const res = await axiosInstance.post(`/profile/follow/${targetUserId}`);
    toast.success(res?.data?.isFollowing ? 'User followed' : 'User unfollowed')
    return res?.data;
  } catch (error) {
    console.log("profile upadting error",error);
    toast.error(error?.response?.data?.message || 'Failed to follow user');
    return rejectWithValue(error?.response?.data?.message)
  }
})

export const updateProfile = createAsyncThunk("updateProfile", async(data,{rejectWithValue}) => {
  try {
    const res = await axiosInstance.put('/profile/update', data);
    toast.success(res?.data?.message || 'Profile updated successfully');
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to update profile')
    return rejectWithValue(error?.response?.data)
  }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    activeProfile: null,
    loading: false,
    error: null,
     followStatus: {},
     isUpdating: false,
  },
  reducers: {
    // Update relationship status locally if user clicks "Follow"
    // updateFollowStatus: (state, action) => {
    //   if(state.activeProfile) {
    //     state.activeProfile.relationship.isFollowing = action.payload;
    //     state.activeProfile.stats.followers += action.payload ? 1 : -1;
    //   }
    // },
  // optimisticFollowToggle: (state, action) => {  // existing
  // seedFollowStatus: (state, action) => {               // ← add this
  //   action.payload.forEach(id => {
  //     state.followStatus[id] = true;
  //   });
  // }



  optimisticFollowToggle: (state, action) => {
    const userId = action.payload;

    // toggle follow status locally
    state.followStatus[userId] = !state.followStatus[userId];

    // also update active profile if it's the same user
    if (state.activeProfile && state.activeProfile.accountId === userId) {
      const isFollowing = state.followStatus[userId];

      state.activeProfile.relationship.isFollowing = isFollowing;
      state.activeProfile.stats.followers += isFollowing ? 1 : -1;
    }
  },

  seedFollowStatus: (state, action) => {
    action.payload.forEach(id => {
      state.followStatus[id] = true;
    });
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
    const { isFollowing, targetUserId } = action.payload;
      state.followStatus[targetUserId] = isFollowing; 
      
    if(!state.activeProfile) return;
    state.activeProfile.relationship.isFollowing = action.payload?.isFollowing;
    
    // state.activeProfile.stats.followers = action.payloa
   })
   .addCase(toggleFollow.rejected, (state, action) => {
     if(state.activeProfile) {
      const failedAttemptWasFollow = !state.activeProfile.relationship.isFollowing;
      state.activeProfile.relationship.isFollowing = !state.activeProfile.relationship.isFollowing;
      state.activeProfile.stats.followers += failedAttemptWasFollow ? -1 : 1;
     }
     state.error = action.payload?.message || 'Follow action failed';
   })
   .addCase(updateProfile.pending, (state) => {
    state.isUpdating = true;
   })
   .addCase(updateProfile.fulfilled, (state, action)=> {
    state.isUpdating = false;
    state.activeProfile = {...state.activeProfile , ...action.payload.data};
    state.error = null;
   })
   .addCase(updateProfile.rejected, (state, action) => {
    state.isUpdating = false;
    state.error = action.payload?.message;
   })
  }
})

export const { optimisticFollowToggle, seedFollowStatus } = profileSlice.actions;
export default profileSlice.reducer;