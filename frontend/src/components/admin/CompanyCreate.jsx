import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../redux/slices/companySlice";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../shared/Navbar";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerCompany = async () => {
    if (!companyName.trim()) { toast.error("Company name is required"); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, { withCredentials: true });
      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create company");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Register Your Company</h1>
          <p className="text-gray-500 text-sm mb-6">What's your company name? You can change this later.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Acme Corp" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate(-1)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={registerCompany} disabled={loading}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin w-4 h-4" />Creating...</> : "Continue →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyCreate;
