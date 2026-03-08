import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BookmarkCheck, Trash2, Briefcase } from "lucide-react";
import { toggleSaveJob } from "../redux/slices/jobSlice";
import Navbar from "../components/shared/Navbar";
import JobCard from "../components/job/JobCard";

const SavedJobs = () => {
  const { allJobs, savedJobs } = useSelector((s) => s.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = allJobs.filter((j) => savedJobs.includes(j._id));

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <BookmarkCheck className="text-purple-600" size={24} /> Saved Jobs
            </h1>
            <p className="text-gray-500 text-sm mt-1">{saved.length} jobs bookmarked</p>
          </div>
        </div>
        {saved.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-purple-300" size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-700 mb-1">No saved jobs yet</h3>
            <p className="text-sm text-gray-400 mb-4">Bookmark jobs to save them here</p>
            <button onClick={() => navigate("/jobs")} className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700">Browse Jobs</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};
export default SavedJobs;