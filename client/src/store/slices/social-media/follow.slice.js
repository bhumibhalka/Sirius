import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

export const fetchFollower = createAsyncThunk("fetchFollower", async({cursor}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(`/follow/get-info?cursor=${cursor || ''}`);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data || "Failed to fetch followers")
    return rejectWithValue(error?.response?.data || "Failed to fetch followers")
  }
})

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    items: [],
    loading : false,
    nextCursor: ''
  },
  reducers: {},
  extraReducers: (builder) => {
   builder
   .addCase(fetchFollower.pending, (state)=> {
    state.loading = true;
   })
   .addCase(fetchFollower.fulfilled , (state, action)=> {
    state.loading = false;
    state.items = action.payload?.data;
    state.nextCursor = action.payload?.nextCursor;
   })
   .addCase(fetchFollower.rejected, (state) => {
    state.pending = false;
   })
  }
})

export default followSlice.reducer;