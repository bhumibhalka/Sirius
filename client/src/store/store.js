import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/auth.slice"
import popupReducer from "./slices/popup.slice"
import productReducer from "./slices/product.slice"
import cartReducers from "./slices/cart.slice"
import postReducers from "./slices/social-media/post.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    product: productReducer,
    cart: cartReducers,
    post: postReducers,
  }
})