import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setSingleJob, toggleSaveJob } from "../../redux/slices/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "../../utils/constant";
import { MapPin, Clock, DollarSign, Users, ArrowLeft, Briefcase, Bookmark, BookmarkCheck, Building2, Zap, Calendar, Award } from "lucide-react";
import Navbar from "../shared/Navbar";

const BRAND_COLORS = {
  google:"#4285F4", microsoft:"#00A4EF", amazon:"#FF9900", meta:"#0082FB",
  netflix:"#E50914", flipkart:"#2874F0", infosys:"#007CC3", razorpay:"#3395FF",
  swiggy:"#FC8019", zomato:"#E23744", paytm:"#002970", uber:"#1a1a1a",
  atlassian:"#0052CC", adobe:"#FF0000", salesforce:"#00A1E0", spotify:"#1DB954",
  airbnb:"#FF5A5F", linkedin:"#0A66C2", wipro:"#341C73", twitter:"#1DA1F2",
};

const calcMatch = (skills, reqs) => {
  if (!skills?.length || !reqs?.length) return null;
  const sl = skills.map(s => s.toLowerCase());
  const matched = reqs.filter(r => sl.some(s => r.toLowerCase().includes(s) || s.includes(r.toLowerCase())));
  return Math.round((matched.length / reqs.length) * 100);
};

const JobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleJob, savedJobs } = useSelector((s) => s.job);
  const { user } = useSelector((s) => s.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const isSaved = savedJobs.includes(id);
  const match = calcMatch(user?.profile?.skills, singleJob?.requirements);
  const coName = singleJob?.company?.name?.toLowerCase().replace(/\s/g, "") || "";
  const brandColor = BRAND_COLORS[coName] || "#6A38C2";

  useEffect(() => {
    axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true }).then(res => {
      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        setIsApplied(res.data.job.applications.some(a => a.applicant === user?._id));
      }
    }).catch(console.error);
  }, [id]);

  const apply = async () => {
    if (!user) { toast.error("Please login to apply"); return; }
    setApplying(true);
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}`, { withCredentials: true });
      if (res.data.success) {
        setIsApplied(true);
        dispatch(setSingleJob({ ...singleJob, applications: [...singleJob.applications, { applicant: user._id }] }));
        toast.success("Application submitted! 🎉");
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setApplying(false); }
  };

  const daysAgo = singleJob ? Math.floor((new Date() - new Date(singleJob.createdAt)) / 86400000) : 0;

  if (!singleJob) return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse space-y-4">
          <div className="flex gap-4"><div className="w-16 h-16 skeleton rounded-2xl"/><div className="flex-1 space-y-2"><div className="h-6 skeleton rounded-lg w-2/3"/><div className="h-4 skeleton rounded-lg w-1/3"/></div></div>
          <div className="h-4 skeleton rounded-lg"/><div className="h-4 skeleton rounded-lg w-5/6"/><div className="h-4 skeleton rounded-lg w-4/6"/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm mb-6 transition font-medium group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Jobs
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Colored header band */}
          <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${brandColor}, ${brandColor}99)` }} />

          {/* Job header */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {singleJob.company?.logo && !imgErr
                    ? <img src={singleJob.company.logo} alt="" onError={() => setImgErr(true)} className="w-full h-full object-contain p-1.5" />
                    : <div className="w-full h-full rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: brandColor }}>
                        {singleJob.company?.name?.[0]}
                      </div>
                  }
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">{singleJob.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 size={14} className="text-gray-400" />
                    <span className="text-gray-600 font-semibold text-sm">{singleJob.company?.name}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500 text-sm">{singleJob.company?.location}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { if (!user) { toast.error("Login to save"); return; } dispatch(toggleSaveJob(id)); toast.success(isSaved ? "Removed" : "Saved!"); }}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${isSaved ? "bg-purple-50 border-purple-200 text-purple-600" : "border-gray-200 text-gray-400 hover:border-purple-200 hover:text-purple-500"}`}>
                  {isSaved ? <BookmarkCheck size={16}/> : <Bookmark size={16}/>}
                </button>
                <button onClick={apply} disabled={isApplied || user?.role !== "student" || applying}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isApplied ? "bg-green-50 text-green-700 border border-green-200 cursor-default" : user?.role !== "student" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 shadow-sm shadow-purple-200"}`}>
                  {applying ? "Applying..." : isApplied ? "✓ Applied" : "Apply Now"}
                </button>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { icon: MapPin, text: singleJob.location },
                { icon: DollarSign, text: `${singleJob.salary} LPA` },
                { icon: Users, text: `${singleJob.applications?.length} applicants` },
                { icon: Clock, text: daysAgo === 0 ? "Posted today" : `${daysAgo}d ago` },
                { icon: Briefcase, text: singleJob.jobType },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Icon size={13} className="text-gray-400" />{text}
                </span>
              ))}
            </div>

            {/* AI Match */}
            {match !== null && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${match >= 70 ? "bg-green-50 text-green-700 border-green-200" : match >= 40 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                <Zap size={14} />
                {match}% skill match — {match >= 70 ? "Great fit! You should apply." : match >= 40 ? "Decent match. Worth applying." : "Low match. Consider upskilling."}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 grid sm:grid-cols-3 gap-8">
            <div className="sm:col-span-2 space-y-8">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><Briefcase size={15} className="text-purple-500"/>About the Role</h2>
                <p className="text-gray-600 text-sm leading-7">{singleJob.description}</p>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><Award size={15} className="text-purple-500"/>Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {singleJob.requirements?.map((req, i) => {
                    const userHas = user?.profile?.skills?.some(s => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <span key={i} className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${userHas ? "bg-green-50 text-green-700 border-green-200" : "bg-purple-50 text-purple-700 border-purple-100"}`}>
                        {userHas && "✓ "}{req}
                      </span>
                    );
                  })}
                </div>
                {user?.profile?.skills?.length > 0 && <p className="text-xs text-gray-400 mt-2">✓ = skills you already have</p>}
              </div>
            </div>

            {/* Sidebar details */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-gray-900 mb-1">Job Details</h2>
              {[
                { label: "Job Type", value: singleJob.jobType, icon: Briefcase },
                { label: "Experience", value: `${singleJob.experienceLevel} years`, icon: Award },
                { label: "Openings", value: singleJob.position, icon: Users },
                { label: "Salary", value: `${singleJob.salary} LPA`, icon: DollarSign },
                { label: "Posted", value: daysAgo === 0 ? "Today" : `${daysAgo}d ago`, icon: Calendar },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <Icon size={15} className="text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-bold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
              {!isApplied && user?.role === "student" && (
                <button onClick={apply} disabled={applying}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold rounded-xl text-sm hover:from-purple-700 hover:to-violet-600 transition shadow-sm mt-2">
                  {applying ? "Applying..." : "Apply for this Job →"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobDescription;