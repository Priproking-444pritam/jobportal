import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import Companies from "./pages/Companies";
import ResumeAnalyser from "./pages/ResumeAnalyser";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/profile/Profile";
import JobDescription from "./components/job/JobDescription";

import AdminCompanies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import AdminDashboard from "./components/admin/AdminDashboard";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" />;
};
const RecruiterRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user?.role === "recruiter" ? children : <Navigate to="/" />;
};
const GuestRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return !user ? children : <Navigate to="/" />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/description/:id" element={<JobDescription />} />
      <Route path="/resume-analyser" element={<ResumeAnalyser />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/saved-jobs" element={<PrivateRoute><SavedJobs /></PrivateRoute>} />
      <Route path="/admin" element={<RecruiterRoute><AdminDashboard /></RecruiterRoute>} />
      <Route path="/admin/companies" element={<RecruiterRoute><AdminCompanies /></RecruiterRoute>} />
      <Route path="/admin/companies/create" element={<RecruiterRoute><CompanyCreate /></RecruiterRoute>} />
      <Route path="/admin/companies/:id" element={<RecruiterRoute><CompanySetup /></RecruiterRoute>} />
      <Route path="/admin/jobs" element={<RecruiterRoute><AdminJobs /></RecruiterRoute>} />
      <Route path="/admin/jobs/create" element={<RecruiterRoute><PostJob /></RecruiterRoute>} />
      <Route path="/admin/jobs/:id/applicants" element={<RecruiterRoute><Applicants /></RecruiterRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);

export default App;