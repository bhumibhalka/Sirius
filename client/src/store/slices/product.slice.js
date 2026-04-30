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

export const editProduct = createAsyncThunk("editProduct", async({id ,data}, thunkAPI)=> {
  try {
    const res = await axiosInstance.put("/product/update-product", {id, ...data});
    toast.success(res?.data?.message || 'Product edited successfully')
    console.log(res?.data?.product);
    return res?.data?.product;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to edit porduct')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

export const deleteProduct = createAsyncThunk("deleteProduct", async(id,thunkAPI)=> {
  try {
    const res = await axiosInstance.delete(`/product/delete/${id}`);
    toast.success(res?.data?.message || 'Product deleted successfully');
    return res?.data?.id;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to delete product')
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
})

export const fetchProducts = createAsyncThunk("fetchProducts", async(_, thunkAPI) => {
   try {
    const res = await axiosInstance.get('/product/all-products');
    return res?.data?.products;
   } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch products')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
   }
})

export const getProduct = createAsyncThunk("getProduct", async(id, thunkAPI)=> {
  try {
    const res = await axiosInstance.get(`/product/${id}`);
    return res?.data?.product;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to fetch product')
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})


const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    sellerProducts: [],
    cartItems: [],
    product: null,
    // product: null,
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
  .addCase(editProduct.pending, (state) => {
    state.loading = true;
  })
  .addCase(editProduct.fulfilled, (state, action) => {
    state.loading = false;
    state.products = state.products.map((p) => p._id === action.payload?._id ? action.payload : p)
  })
  .addCase(editProduct.rejected, (state) => {
    state.loading = false;
  })
  .addCase(deleteProduct.pending, (state)=> {
    state.loading = true;
  })
  .addCase(deleteProduct.fulfilled, (state, action) => {
    state.loading = false;
    state.products = state.products.filter((p) => p._id !== action.payload)
  })
  .addCase(deleteProduct.rejected, (state)=> {
    state.loading = false;
  })
  .addCase(fetchProducts.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchProducts.fulfilled, (state, action)=>{
    state.loading = false;
    state.products = action.payload;
  })
  .addCase(fetchProducts.rejected, (state)=>{
    state.loading = false;
  })
  .addCase(getProduct.pending, (state)=> {
    state.loading = true;
  })
  .addCase(getProduct.fulfilled, (state, action)=> {
    state.loading = false;
    state.product = action.payload;
  })
  .addCase(getProduct.rejected, (state)=> {
    state.loading = false;
  })

  }
})

export default productSlice.reducer;
