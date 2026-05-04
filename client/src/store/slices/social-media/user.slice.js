import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';

export const fetchUsers = createAsyncThunk("fetchUsers", async({search, cursor}, {rejectWithValue}) => {
try {
  const res = await axiosInstance.get(`/user/search-users`, {
    params: {search, cursor, limit :20}
  })
  return res?.data;
} catch (error) {
  toast.error(error?.response?.data?.message || 'Failed to fetch users')
  return rejectWithValue(error?.response?.data?.message)
}
})



const userSlice = createSlice({
  name: 'user',
  initialState: {
     items: [],
     loading : false,
     nextCursor: null
  },
  reducers: {},
  extraReducers: (builder) => {
  builder
  .addCase(fetchUsers.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchUsers.fulfilled, (state, action) => {
    state.loading = false;
    if(!action.meta.arg.cursor){
      state.items = action.payload.data;
    }else {
      state.items = [...state.items, ...action.payload.data];
    }
    state.nextCursor = action.payload.nextCursor;
  } )
  }
})

export default userSlice.reducer;