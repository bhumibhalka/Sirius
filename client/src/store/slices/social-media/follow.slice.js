import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

export const fetchFollowData = createAsyncThunk("", async({userId,type, cursor}, {rejectWithValue})=> {
  try {
    const res = await axiosInstance.get(`/follow/${userId}/follow-data?type=${type}&cursor=${cursor || ''}`);
    return {
      data: res?.data?.data,
      type,
      nextCursor: res?.data?.nextCursor,
    }
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to fetch followData')
    return rejectWithValue(error?.response?.data || 'Failed to fetch follow data')
  }
})

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followers: {
      list: [],
      loading: false,
      cursor: null,
    },
    following: {
      list: [],
      loading: false,
      cursor: null,
    }
  },
  reducers: {},
  extraReducers: (builder) => {
   builder
   .addCase(fetchFollowData.pending, (state, action) => {
    state[action.meta.arg.type].loading = true;
   })
   .addCase(fetchFollowData.fulfilled, (state, action) => {
    const {type, data, nextCursor} = action.payload;
     state[type].loading = false;
     state[type].list = action.meta.arg.cursor 
     ? [...state[type].list, ...data]
     : data;
     state[type].cursor = nextCursor;
   })
  //  .addCase(fetchFollowData.rejected, (state, action)=> {
  //   state[type].loading = false;
  //  })

  }
})

export default followSlice.reducer;