import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "admin",
  initialState: {
    listNagivation: [
      {
        title: "Home",
        path: "/admin",
        isChoose: false,
      },
      {
        title: "Product",
        path: "/admin/product",
        isChoose: false,
      },
      {
        title: "Order",
        path: "/admin/order",
        isChoose: false,
      },
    ],
  },
  reducers: {
    getData: (state, action) => {
      // state.data = action.payload;
    },
    changeCity: (state, action) => {
      // state.city = action.payload;
    },
    changeForecast: (state, action) => {
      // state.forecast = action.payload;
    },
    chooseNav: (state, action) => {
      state.listNagivation = state.listNagivation.map((item) => {
        if (item.path == action.payload) {
          return {
            ...item,
            isChoose: true,
          };
        } else {
          return {
            ...item,
            isChoose: false,
          };
        }
      });
    },
  },
});
