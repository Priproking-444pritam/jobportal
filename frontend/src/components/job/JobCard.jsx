import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Zap, Users } from "lucide-react";
import { toggleSaveJob } from "../../redux/slices/jobSlice";
import { toast } from "sonner";

const BRAND_COLORS = {
  google: "#4285F4", microsoft: "#00A4EF", amazon: "#FF9900", meta: "#0082FB",
  netflix: "#E50914", flipkart: "#2874F0", infosys: "#007CC3", razorpay: "#3395FF",
  swiggy: "#FC8019", zomato: "#E23744", paytm: "#002970", uber: "#000000",
  atlassian: "#0052CC", adobe: "#FF0000", salesforce: "#00A1E0", spotify: "#1DB954",
  airbnb: "#FF5A5F", linkedin: "#0A66C2", wipro: "#341C73", twitter: "#1DA1F2",
};

// AI Match Score calculation
const calcMatchScore = (userSkills, jobRequirements) => {
  if (!userSkills?.length || !jobRequirements?.length) return null;
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const matched = jobRequirements.filter((req) =>
    userSkillsLower.some((skill) => req.toLowerCase().includes(skill) || skill.includes(req.toLowerCase()))
  );
  return Math.round((matched.length / jobRequirements.length) * 100);
};

const MatchBadge = ({ score }) => {
  if (score === null) return null;
  const color = score >= 70 ? "text-green-700 bg-green-50 border-green-200"
    : score >= 40 ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
      <Zap size={10} /> {score}% match
    </span>
  );
};

const CompanyLogo = ({ company }) => {
  const [imgError, setImgError] = useState(false);
  const name = company?.name || "";
  const key = name.toLowerCase().replace(/\s/g, "");
  const color = BRAND_COLORS[key] || "#6A38C2";

  if (company?.logo && !imgError) {
    return (
      <img src={company.logo} alt={name} onError={() => setImgError(true)}
        className="w-full h-full object-contain p-1.5" />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center font-bold text-white text-base rounded-xl"
      style={{ background: color }}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

const JobCard = ({ job, index = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { savedJobs, allAppliedJobs } = useSelector((s) => s.job);

  const isSaved = savedJobs.includes(job._id);
  const isApplied = allAppliedJobs.some((a) => a?.job?._id === job._id);
  const matchScore = calcMatchScore(user?.profile?.skills, job?.requirements);
  const daysAgo = Math.floor((new Date() - new Date(job?.createdAt)) / (1000 * 60 * 60 * 24));

  const handleSave = (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please login to save jobs"); return; }
    dispatch(toggleSaveJob(job._id));
    toast.success(isSaved ? "Removed from saved" : "Job saved!");
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-5 card-hover cursor-pointer group relative overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/description/${job._id}`)}
    >
      {/* Subtle gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} />{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
          {isApplied && (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
              ✓ Applied
            </span>
          )}
        </div>
        <button onClick={handleSave}
          className={`p-1.5 rounded-lg transition ${isSaved ? "text-purple-600 bg-purple-50" : "text-gray-300 hover:text-purple-500 hover:bg-purple-50"}`}>
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
          <CompanyLogo company={job?.company} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition leading-tight truncate">
            {job?.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{job?.company?.name}</p>
        </div>
      </div>

      {/* Match score */}
      {matchScore !== null && <div className="mb-2.5"><MatchBadge score={matchScore} /></div>}

      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{job?.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {job?.requirements?.slice(0, 3).map((req, i) => (
          <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-lg font-medium border border-purple-100">
            {req}
          </span>
        ))}
        {job?.requirements?.length > 3 && (
          <span className="text-xs text-gray-400 px-2 py-0.5">+{job.requirements.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><MapPin size={11} />{job?.location}</span>
          <span className="flex items-center gap-1"><DollarSign size={11} />{job?.salary} LPA</span>
        </div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition">
          {job?.jobType}
        </span>
      </div>
    </div>
  );
};

export default JobCard;