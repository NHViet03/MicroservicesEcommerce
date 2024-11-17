import { configureStore } from "@reduxjs/toolkit";

import AdminSlice from "./AdminSlice/adminSlice";

const store = configureStore({
  reducer: {
    admin: AdminSlice.reducer,
  },
});

export default store;
