import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";


export const login = createAsyncThunk("login", async(data, thunkAPI)=>{
  try {
    const res = await axiosInstance.post("/auth/login", data);
    toast.success(res?.data?.message || "User logged in successfully");
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to login the user");
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

export const register = createAsyncThunk("register", async(data, thunkAPI)=> {
  try {
    const res = await axiosInstance.post("/auth/register", data)
    toast.success(res?.data?.message || "User registered successfully")
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to register the user")
    return thunkAPI.rejectWithValue(error?.response?.data?.message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null ,
    userProfile: null,
  },
  reducers: {},
  extraReducers: (builder) => {
   builder
   .addCase(login.pending, (state)=>{
    state.loading = true;
   })
   .addCase(login.fulfilled, (state, action)=> {
    state.loading = false;
    state.user = action.payload.user;
    state.userProfile = action.payload.profile;
   })
   .addCase(login.rejected, (state)=> {
    state.loading = false;
   })
   .addCase(register.pending, (state)=> {
    state.loading = true;
   })
   .addCase(register.fulfilled, (state, action) => {
    state.loading = false;
    state.user = action.payload.user;
    state.userProfile = action.payload.userProfile;
   })
   .addCase(register.rejected,(state)=> {
    state.loading = false
   })
  }
})

export default authSlice.reducer;