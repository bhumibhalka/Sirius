import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";


export const addToCart = createAsyncThunk('addToCart', async(data, thunkAPI)=>{
  try {
    const res = await axiosInstance.put('/cart/add-to-cart', data);
    toast.success(res?.data?.message || 'Product added');
    return res?.data?.cart;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to add product');
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
})

export const getCartItems = createAsyncThunk('getCartItems', async(_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/cart/cart-items');
    return res?.data?.cartItems;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch cart items')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    loading: false,
    cartItems: [],
  },
  reducers: {},
  extraReducers: (builder) => {
  builder
  .addCase(addToCart.pending, (state)=> {
    state.loading = true;
  })
  .addCase(addToCart.fulfilled, (state, action)=> {
    state.loading = false;
    state.cartItems = action.payload;
  })
  .addCase(addToCart.rejected, (state) => {
    state.loading = false;
  })
  .addCase(getCartItems.pending, (state) => {
    state.loading = true;
  })
  .addCase(getCartItems.fulfilled, (state, action) => {
    state.loading = false;
    state.cartItems = action.payload;
  })
  .addCase(getCartItems.rejected, (state) => {
    state.loading = false;
  })
  }
})

export default cartSlice.reducer;