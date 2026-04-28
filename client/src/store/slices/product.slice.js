import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

// export const addProduct = createAsyncThunk("addProduct", async(data, thunkAPI)=> {
//   try {
//     const res = await axiosInstance.post('/product/add-product',data);
//     toast.success(res?.data?.message || 'Product added successfully');
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message || 'Failed to add product')
//     return thunkAPI.rejectWithValue(error?.response?.data?.message)
//   }
// })

export const addProduct = createAsyncThunk("addProduct", async(data, thunkAPI) => {
   try {
     const res = await axiosInstance.post('/product/add-product', data);
     toast.success(res?.data?.message || 'Product added successfully');
     return res?.data;
   } catch (error) {
     toast.error(error?.response?.data?.message || 'Failed to add product')
     return thunkAPI.rejectWithValue(error?.response?.data?.message)
   }
}) 

export const fetchUserProducts = createAsyncThunk("fetchUserProducts", async(_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/product/fetch-seller-products");
    return res?.data?.products;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch sellers products')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    sellerProducts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
   builder.
   addCase(addProduct.pending, (state) => {
    state.loading = true;
   })
  .addCase(addProduct.fulfilled, (state, action)=> {
    state.loading = false;
    state.products.push(action.payload?.product);
  })
  .addCase(addProduct.rejected, (state) => {
    state.loading = false;
  })
  .addCase(fetchUserProducts.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchUserProducts.fulfilled, (state, action) => {
    state.loading = false;
    state.products = action.payload;
  })
  .addCase(fetchUserProducts.rejected, (state) => {
    state.loading = false;
  })
  }
})

export default productSlice.reducer;
