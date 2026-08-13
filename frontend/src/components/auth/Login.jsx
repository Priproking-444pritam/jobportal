import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/slices/authSlice";
import { USER_API_END_POINT } from "../../utils/constant";
import { Loader2, Briefcase, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const change = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(`Welcome back, ${res.data.user.fullname}!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] dark:bg-gray-950 flex transition-colors duration-300">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 relative overflow-hidden flex-col items-center justify-center p-14">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Briefcase className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Welcome Back!</h2>
          <p className="text-purple-200 text-base max-w-xs leading-relaxed">
            Sign in to access 40+ job opportunities from top companies across India.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-left">
            {[["40+", "Live Jobs"], ["20+", "Companies"], ["8", "Categories"], ["Free", "Always"]].map(([num, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="text-xl font-extrabold text-white">{num}</div>
                <div className="text-purple-200 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-500 rounded-xl flex items-center justify-center">
              <Briefcase className="text-white" size={17} />
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">Job<span className="gradient-text">Portal</span></span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Sign in</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-bold hover:underline">Create one free →</Link>
          </p>

          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={input.email} onChange={change} required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 placeholder-gray-400"
                  placeholder="you@example.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={input.password} onChange={change} required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 placeholder-gray-400"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[["student", "🔍 Job Seeker"], ["recruiter", "🏢 Recruiter"]].map(([r, label]) => (
                  <label key={r} className={`flex items-center gap-2.5 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                    input.role === r
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800"
                  }`}>
                    <input type="radio" name="role" value={r} checked={input.role === r} onChange={change} className="accent-purple-600 w-4 h-4" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all shadow-sm shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading
                ? <><Loader2 className="animate-spin" size={16} /> Signing in...</>
                : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo recruiter: <strong>recruiter@seed.com</strong> / <strong>password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;