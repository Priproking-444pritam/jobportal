import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSingleCompany } from "../../redux/slices/companySlice";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../shared/Navbar";

const CompanySetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ name: "", description: "", website: "", location: "", file: null });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, { withCredentials: true });
        if (res.data.success) {
          const c = res.data.company;
          dispatch(setSingleCompany(c));
          setInput({ name: c.name || "", description: c.description || "", website: c.website || "", location: c.location || "", file: null });
        }
      } catch (error) { console.error(error); }
    };
    fetchCompany();
  }, [id]);

  const change = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(input).forEach(([k, v]) => { if (k !== "file" && v) formData.append(k, v); });
    if (input.file) formData.append("file", input.file);
    try {
      setLoading(true);
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, withCredentials: true,
      });
      if (res.data.success) { toast.success(res.data.message); navigate("/admin/companies"); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
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
          <h1 className="text-xl font-bold text-gray-900 mb-1">Company Setup</h1>
          <p className="text-gray-500 text-sm mb-6">Complete your company profile</p>
          <form onSubmit={submitHandler} className="space-y-4">
            {[["name","Company Name","text"],["description","Description","text"],["website","Website","url"],["location","Location","text"]].map(([name,label,type]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} name={name} value={input[name]} onChange={change}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <input type="file" accept="image/*" onChange={(e) => setInput({ ...input, file: e.target.files[0] })}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-medium" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin w-4 h-4" />Saving...</> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CompanySetup;
