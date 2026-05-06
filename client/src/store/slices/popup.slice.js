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
    isEditProfileOpen: false,
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
    },
    toggleEditProfileModal: (state) => {
      state.isEditProfileOpen = !state.isEditProfileOpen;
    }
  }
})

export const {toggleMenu, toggleAddProduct, toggleEditModal, toggleUploadPost, toggleSearchOpen, toggleCommentModal, toggleEditProfileModal} = popupSlice.actions;

export default popupSlice.reducer;