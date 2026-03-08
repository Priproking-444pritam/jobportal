import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Plus, Search, Briefcase } from "lucide-react";
import Navbar from "../shared/Navbar";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const { allAdminJobs } = useSelector((store) => store.job);
  const [filterText, setFilterText] = useState("");
  const filtered = allAdminJobs.filter((j) =>
    j.title.toLowerCase().includes(filterText.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posted Jobs</h1>
            <p className="text-gray-500 text-sm mt-1">{allAdminJobs.length} jobs posted</p>
          </div>
          <button onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Filter jobs..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm">No jobs posted yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Title</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Applicants</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job._id} className="border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}>
                    <td className="py-3 px-4 font-medium text-gray-800">{job.title}</td>
                    <td className="py-3 px-4 text-gray-500">{job.company?.name}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">{job.applications?.length || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminJobs;
