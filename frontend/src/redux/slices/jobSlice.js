import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    searchedQuery: "",
    allAppliedJobs: [],
    savedJobs: [],        // NEW
  },
  reducers: {
    setAllJobs: (state, action) => { state.allJobs = action.payload; },
    setSingleJob: (state, action) => { state.singleJob = action.payload; },
    setAllAdminJobs: (state, action) => { state.allAdminJobs = action.payload; },
    setSearchJobByText: (state, action) => { state.searchJobByText = action.payload; },
    setSearchedQuery: (state, action) => { state.searchedQuery = action.payload; },
    setAllAppliedJobs: (state, action) => { state.allAppliedJobs = action.payload; },
    toggleSaveJob: (state, action) => {
      const jobId = action.payload;
      const exists = state.savedJobs.find((j) => j === jobId);
      if (exists) {
        state.savedJobs = state.savedJobs.filter((j) => j !== jobId);
      } else {
        state.savedJobs.push(jobId);
      }
    },
  },
});

export const {
  setAllJobs, setSingleJob, setAllAdminJobs,
  setSearchJobByText, setSearchedQuery,
  setAllAppliedJobs, toggleSaveJob,
} = jobSlice.actions;
export default jobSlice.reducer;