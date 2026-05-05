import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isMenuOpen: false,
    isAddProductModalOpen: false,
    isEditModalOpen: false,
    isUploadPostModalOpen : false,
    isSearchOpen: false,
    isCommentOpen: false,
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
    },
    toggleSearchOpen: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    toggleCommentModal: (state) => {
      state.isCommentOpen = !state.isCommentOpen;
    }
  }
})

export const {toggleMenu, toggleAddProduct, toggleEditModal, toggleUploadPost, toggleSearchOpen, toggleCommentModal} = popupSlice.actions;

export default popupSlice.reducer;