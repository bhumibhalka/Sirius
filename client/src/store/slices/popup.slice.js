import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isMenuOpen: false,
    isAddProductModalOpen: false,
  },
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    toggleAddProduct: (state) => {
      state.isAddProductModalOpen = !state.isAddProductModalOpen;
    }
  }
})

export const {toggleMenu, toggleAddProduct} = popupSlice.actions;

export default popupSlice.reducer;