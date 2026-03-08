import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../../redux/slices/applicationSlice";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import { ArrowLeft, FileText } from "lucide-react";
import Navbar from "../shared/Navbar";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  accepted: "bg-green-50 text-green-700 border border-green-100",
  rejected: "bg-red-50 text-red-700 border border-red-100",
};

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, { withCredentials: true });
        if (res.data.success) dispatch(setAllApplicants(res.data.job));
      } catch (error) { console.error(error); }
    };
    fetchApplicants();
  }, [id]);

  const updateStatus = async (applicationId, status) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        // refetch
        const res2 = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, { withCredentials: true });
        if (res2.data.success) dispatch(setAllApplicants(res2.data.job));
      }
    } catch (error) { toast.error(error.response?.data?.message || "Update failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">{applicants?.applications?.length || 0} applications received</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {!applicants?.applications?.length ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">No applicants yet for this job.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Applicant</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Resume</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants?.applications?.map((app) => (
                  <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-800">{app?.applicant?.fullname}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{app?.applicant?.email}</td>
                    <td className="py-3 px-4">
                      {app?.applicant?.profile?.resume ? (
                        <a href={app.applicant.profile.resume} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-purple-600 text-xs font-medium hover:underline">
                          <FileText className="w-3.5 h-3.5" />View
                        </a>
                      ) : <span className="text-gray-400 text-xs">N/A</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{new Date(app?.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${statusColors[app?.status] || statusColors.pending}`}>{app?.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select value={app?.status} onChange={(e) => updateStatus(app._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer bg-white">
                        <option value="pending">Pending</option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                      </select>
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
export default Applicants;
