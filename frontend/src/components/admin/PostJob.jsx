import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "../../utils/constant";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../shared/Navbar";

const PostJob = () => {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ title: "", description: "", requirements: "", salary: "", location: "", jobType: "Full Time", experience: "", position: "", companyId: "" });
  const change = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.companyId) { toast.error("Please select a company"); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, { withCredentials: true });
      if (res.data.success) { toast.success(res.data.message); navigate("/admin/jobs"); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Post a New Job</h1>
          <p className="text-gray-500 text-sm mb-6">Fill in the details to attract the right candidates</p>
          {companies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm mb-3">You need to register a company first.</p>
              <button onClick={() => navigate("/admin/companies/create")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">Create Company</button>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[["title","Job Title","text"],["salary","Salary (LPA)","number"],["location","Location","text"],["experience","Experience (yrs)","number"],["position","No. of Positions","number"]].map(([name,label,type]) => (
                  <div key={name} className={name === "title" ? "col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} name={name} value={input[name]} onChange={change} required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select name="jobType" value={input.jobType} onChange={change}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {["Full Time","Part Time","Contract","Internship"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <select name="companyId" value={input.companyId} onChange={change}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Select company</option>
                    {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements <span className="text-gray-400">(comma separated)</span></label>
                <input name="requirements" value={input.requirements} onChange={change}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={input.description} onChange={change} rows={4} required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe the role and responsibilities..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="animate-spin w-4 h-4" />Posting...</> : "Post Job"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default PostJob;
