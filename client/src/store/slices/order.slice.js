import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

export const placeOrder = createAsyncThunk('orders/placeOrder' , async(orderData, {rejectWithValue}) => {
  try {
    console.log("ORDER DATA:", orderData);

    const orderRes = await axiosInstance.post('/order/create', orderData)

     console.log("ORDER RESPONSE:", orderRes.data);

    const {orderId} = orderRes?.data;

    const stripeRes = await axiosInstance.post('/payment/create-checkout/session', {orderId})

     console.log("STRIPE RESPONSE:", stripeRes.data);

    return {
      order: orderRes?.data?.order,
      clientSecret: stripeRes.data.clientSecret
    };
  } catch (error) {

    console.log("FULL ERROR:", error);
    console.log("ERROR RESPONSE:", error.response?.data);
    toast.error('Failed to create order')
    return rejectWithValue(error?.response?.data);
  }
})

export const fetchMyOrders = createAsyncThunk("fetchOrders", async(cursor, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(`/order/get-orders?cursor=${cursor}`);
    return res?.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data);
  }
})

// export const getSellerOrders = createAsyncThunk("getSellerOrders", async({status, cursor}, {rejectWithValue}) => {
//   try {
//     const res = await axiosInstance.get(`/order/seller-orders?status=${status || ''}&cursor=${cursor || ''}`)
//     return res?.data;
//   } catch (error) {
//     // toast.error(error?.response?.data || 'Failed to fetch seller orders')
//     return rejectWithValue(error?.response?.data || 'Failed to fetch seller orders')
//   }
// })



const orderSlice = createSlice({
  name: 'order',
  initialState: {
    history: [],
    activeOrder: null,
    clientSecret: null,
    nextCursor: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearActiveOrder: (state) => {
      state.activeOrder = null;
      state.clientSecret = null;
    }
  },
  extraReducers :(builder) => {
  builder
  .addCase(placeOrder.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(placeOrder.fulfilled, (state, action) => {
    state.loading = false;
    state.activeOrder = action.payload.order;
    state.clientSecret  = action.payload.clientSecret;
  })
  .addCase(placeOrder.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload
  })
  .addCase(fetchMyOrders.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchMyOrders.fulfilled, (state, action)=> {
    state.loading = false;
    state.history = action.meta.arg
    ?  [...state.history, ...action.payload.data]
    : action.payload.data;
    state.nextCursor = action.payload.nextCursor;
  })
  // .addCase(fetchSellerOrders.pending, (state, action) => {
  //   state.loading = true;
  //   state.error = null;
  // })
  // .addCase(fetchSellerOrders.fulfilled, (state, action) => {
  //   state.loading = false;
  //   state.history = action.meta.arg 
  //   ? [...state.history , ...action.payload.data]
  //   : action.payload.data;
  //   state.nextCursor = action.payload.data;
  // })
  // .addCase(fetchSellerOrders.rejected, (state, action) => {
  //   state.loading = false;
  //   state.error = action.payload;
  // })
  }
})

export const {clearActiveOrder} = orderSlice.actions;
export default orderSlice.reducer;