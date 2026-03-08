import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../redux/slices/jobSlice";
import { Search, MapPin, TrendingUp, Users, Briefcase, Building2, ArrowRight, Sparkles, Star, ChevronRight, Zap } from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import useGetAllJobs from "../hooks/useGetAllJobs";
import JobCard from "../components/job/JobCard";

const CATEGORIES = [
  { label: "Frontend Developer", icon: "💻", color: "from-blue-50 to-indigo-50 border-blue-100 text-blue-700" },
  { label: "Backend Developer", icon: "⚙️", color: "from-green-50 to-emerald-50 border-green-100 text-green-700" },
  { label: "Full Stack", icon: "🔥", color: "from-orange-50 to-amber-50 border-orange-100 text-orange-700" },
  { label: "Data Scientist", icon: "📊", color: "from-purple-50 to-violet-50 border-purple-100 text-purple-700" },
  { label: "UI/UX Designer", icon: "🎨", color: "from-pink-50 to-rose-50 border-pink-100 text-pink-700" },
  { label: "DevOps Engineer", icon: "🚀", color: "from-cyan-50 to-teal-50 border-cyan-100 text-cyan-700" },
  { label: "Product Manager", icon: "📋", color: "from-yellow-50 to-amber-50 border-yellow-100 text-yellow-700" },
  { label: "Mobile Developer", icon: "📱", color: "from-indigo-50 to-blue-50 border-indigo-100 text-indigo-700" },
];

const STATS = [
  { num: "40+", label: "Live Jobs", icon: Briefcase, color: "text-purple-600 bg-purple-50" },
  { num: "20+", label: "Companies", icon: Building2, color: "text-blue-600 bg-blue-50" },
  { num: "8", label: "Categories", icon: TrendingUp, color: "text-green-600 bg-green-50" },
  { num: "100%", label: "Free to Use", icon: Star, color: "text-amber-600 bg-amber-50" },
];

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5">
    <div className="flex gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 skeleton rounded-lg" />
      <div className="h-3 skeleton rounded-lg w-5/6" />
    </div>
    <div className="flex gap-2 mb-4">
      {[1,2,3].map(i => <div key={i} className="h-6 w-16 skeleton rounded-lg" />)}
    </div>
    <div className="flex gap-4 pt-3 border-t border-gray-50">
      <div className="h-3 w-24 skeleton rounded-lg" />
      <div className="h-3 w-20 skeleton rounded-lg" />
    </div>
  </div>
);

const Home = () => {
  useGetAllJobs();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allJobs } = useSelector((store) => store.job);
  const [query, setQuery] = useState("");
  const [loading] = useState(false);

  const searchHandler = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  const categorySearch = (cat) => {
    dispatch(setSearchedQuery(cat));
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay:"1s"}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-purple-100 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-sm">
            <Sparkles size={13} className="text-purple-500" />
            AI-powered job matching · 40+ curated openings
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-5 leading-[1.08] tracking-tight">
            Find Your{" "}
            <span className="gradient-text">Dream Job</span>
            <br />With AI Matching
          </h1>

          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Get personalized job recommendations based on your skills. Connect with top companies hiring right now.
          </p>

          {/* Search */}
          <form onSubmit={searchHandler} className="flex max-w-2xl mx-auto mb-5">
            <div className="flex flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 flex-1 px-5">
                <Search className="text-gray-400 flex-shrink-0" size={18} />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 py-4 text-sm focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                  placeholder="Job title, company, or skill..." />
              </div>
              <button type="submit"
                className="px-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-sm hover:from-purple-700 hover:to-violet-700 transition flex items-center gap-2 flex-shrink-0 m-1.5 rounded-xl">
                <Search size={15} /> Search
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 mb-10">Popular: React Developer, Product Manager, Data Scientist</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map(({ num, label, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-gray-900 text-base leading-tight">{num}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-sm text-gray-500 mt-0.5">5 curated jobs in each category</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button key={cat.label} onClick={() => categorySearch(cat.label)}
              className={`flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r ${cat.color} border rounded-2xl text-left font-semibold text-sm hover:shadow-md transition-all group`}>
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <div>{cat.label}</div>
                <div className="text-xs font-normal opacity-70">5 jobs</div>
              </div>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Latest Openings</h2>
            <p className="text-sm text-gray-500 mt-0.5">{allJobs.length} positions available right now</p>
          </div>
          <button onClick={() => navigate("/jobs")}
            className="flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:underline">
            View all <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : allJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-purple-300" size={32} />
            </div>
            <h3 className="text-base font-semibold text-gray-500 mb-1">No jobs yet</h3>
            <p className="text-sm text-gray-400">Run <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">node seed.js</code> in backend to populate jobs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.slice(0, 6).map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="relative bg-gradient-to-r from-purple-600 to-violet-600 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <Zap size={12} /> For Recruiters
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Hire Top Talent Fast</h2>
            <p className="text-purple-200 mb-6 max-w-md mx-auto">Post jobs, manage applications, and find your next great hire — all in one place.</p>
            <button onClick={() => navigate("/signup")}
              className="bg-white text-purple-700 font-bold px-8 py-3 rounded-xl hover:bg-purple-50 transition shadow-lg">
              Start Hiring Free →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Home;