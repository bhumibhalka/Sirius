import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/auth.slice"
import popupReducer from "./slices/popup.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
  }
})