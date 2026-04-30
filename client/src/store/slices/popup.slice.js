import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isMenuOpen: false,
    isAddProductModalOpen: false,
    isEditModalOpen: false,
    isUploadPostModalOpen : false,
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
    },
    toggleUploadPost : (state) => {
      state.isUploadPostModalOpen = !state.isUploadPostModalOpen;
    }
  }
})

export const {toggleMenu, toggleAddProduct, toggleEditModal, toggleUploadPost} = popupSlice.actions;

export default popupSlice.reducer;