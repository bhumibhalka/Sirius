import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isMenuOpen: false,
    isAddProductModalOpen: false,
    isEditModalOpen: false,
  },
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    toggleAddProduct: (state) => {
      state.isAddProductModalOpen = !state.isAddProductModalOpen;
    },
    toggleEditModal: (state) => {
      state.isEditModalOpen = !state.isEditModalOpen;
    }
  }
})

export const {toggleMenu, toggleAddProduct, toggleEditModal} = popupSlice.actions;

export default popupSlice.reducer;