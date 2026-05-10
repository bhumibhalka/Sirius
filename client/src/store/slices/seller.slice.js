import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

export const fetchSellerOrders = createAsyncThunk("fetchSellerOrders", async({status, cursor}, {rejectWithValue})=> {
  try {
    const  url = `/order/seller/orders?status=${status || ''}&cursor=${cursor || ''}`;

    const res = await axiosInstance.get(url)
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data || 'Failed to fetch products')
    return rejectWithValue(error?.response?.data)
  }
})

const sellerSlice = createSlice({
  name:'seller',
  initialState: {
    orders: [],
    stats: {totalEarnings: 0, pendingShipments: 0},
    loading: false,// default filter for the dashboard
    filter: 'paid',
  },
  reducers: {
    setOrdersFilter: (state, action) => {
      state.filter = action.payload;
      state.orders = [];
    },
    clearSellerState: (state) => {
      state.orders = [];
      state.stats = {totalEarnings: 0, pendingShipments: 0};
    }
  },
  extraReducers: (builder) => {
   builder
   .addCase(fetchSellerOrders.pending, (state)=> {
    state.loading = true;
   })
   .addCase(fetchSellerOrders.fulfilled, (state, action) => {
    state.loading = false;
    //cusor in query and if it is in query then we have more orders to fetch so add more orders to the old onces and if we do not send cursor means we have fetched all the orders already(nextCursor = null from backend) so show all the orders we have
    state.orders = action.meta.arg.cursor
    ? [...state.orders , ...action.payload.data]
    : action.payload.data;
    // state.nextCursor = action.payload.nextCursor
   })
   .addCase(fetchSellerOrders.rejected, (state) => {
    state.loading = false;
   })
  }
})

export default sellerSlice.reducer;