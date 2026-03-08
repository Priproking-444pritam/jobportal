import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import jobSlice from "./slices/jobSlice.js";
import companySlice from "./slices/companySlice.js";
import applicationSlice from "./slices/applicationSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice,
  },
});

export default store;
