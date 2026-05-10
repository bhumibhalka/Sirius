import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

export const fetchadminStats = createAsyncThunk("fetchadminStats", async({cursor} , {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(`/admin/stats?cursor=${cursor || ''}`);
    return res?.data;
  } catch (error) {
    console.log("error", error)
    toast.error(error?.response?.data )
    return rejectWithValue(error?.response?.data)
  }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    metrics: null,
   charts: {
    orderStatus: [],
    revenueTrend: [],
   },
   loading : false
  },
  reducers: {},
  extraReducers: (builder) => {
  builder
  .addCase(fetchadminStats.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchadminStats.fulfilled, (state, action)=> {
    state.loading = false;
    state.metrics = action.payload.data.summary;
    state.charts.orderStatus = action.payload.data.distribution;
  })
  .addCase(fetchadminStats.rejected, (state) => {
    state.loading = false;
  })
  }
})

export default adminSlice.reducer;