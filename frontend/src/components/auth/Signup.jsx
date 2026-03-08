import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/authSlice";
import { USER_API_END_POINT } from "../../utils/constant";
import { Loader2, Briefcase, Mail, Lock, User, Phone, Upload, ArrowRight } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({ fullname: "", email: "", phoneNumber: "", password: "", role: "student", file: "" });
  const [preview, setPreview] = useState(null);
  const { loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const change = (e) => setInput({ ...input, [e.target.name]: e.target.value });
  const fileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setInput({ ...input, file }); setPreview(URL.createObjectURL(file)); }
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(input).forEach(([k, v]) => { if (k !== "file" && v) fd.append(k, v); });
    if (input.file) fd.append("file", input.file);
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, fd, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
      if (res.data.success) { navigate("/login"); toast.success(res.data.message); }
    } catch (err) { toast.error(err.response?.data?.message || "Signup failed"); }
    finally { dispatch(setLoading(false)); }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Briefcase className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Join JobPortal</h2>
          <p className="text-purple-200 text-sm max-w-xs leading-relaxed mb-8">
            Create your free account and get AI-powered job matches personalized to your skills.
          </p>
          {["AI Match Score on every job", "Save & bookmark jobs", "One-click applications", "Real-time status tracking"].map((feat) => (
            <div key={feat} className="flex items-center gap-2.5 mb-3 text-left">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-purple-100 text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-7 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-500 rounded-xl flex items-center justify-center">
              <Briefcase className="text-white" size={17} />
            </div>
            <span className="text-xl font-extrabold">Job<span className="gradient-text">Portal</span></span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-7">Already have one? <Link to="/login" className="text-purple-600 font-bold hover:underline">Sign in →</Link></p>

          <form onSubmit={submit} className="space-y-4">
            {/* Photo upload */}
            <div className="flex items-center gap-4">
              <label className="cursor-pointer group">
                <div className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-400 ${preview ? "border-purple-300" : "border-gray-200 bg-gray-50"}`}>
                  {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <Upload size={20} className="text-gray-300 group-hover:text-purple-400 transition" />}
                </div>
                <input type="file" accept="image/*" onChange={fileChange} className="hidden" />
              </label>
              <div>
                <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
                <p className="text-xs text-gray-400">Click to upload (optional)</p>
              </div>
            </div>

            {[
              { name: "fullname", label: "Full Name", type: "text", icon: User, placeholder: "John Doe" },
              { name: "email", label: "Email", type: "email", icon: Mail, placeholder: "you@example.com" },
              { name: "phoneNumber", label: "Phone", type: "number", icon: Phone, placeholder: "9876543210" },
              { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "••••••••" },
            ].map(({ name, label, type, icon: Icon, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={type} name={name} value={input[name]} onChange={change} required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder={placeholder} />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[["student", "🔍 Job Seeker"], ["recruiter", "🏢 Recruiter"]].map(([r, label]) => (
                  <label key={r} className={`flex items-center gap-2.5 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${input.role === r ? "border-purple-500 bg-purple-50/70 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                    <input type="radio" name="role" value={r} checked={input.role === r} onChange={change} className="accent-purple-600 w-4 h-4" />
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all shadow-sm shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
              {loading ? <><Loader2 className="animate-spin" size={16} /> Creating...</> : <><span>Create Account</span><ArrowRight size={16}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signup;