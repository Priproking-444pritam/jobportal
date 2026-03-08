import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/slices/authSlice";
import { USER_API_END_POINT } from "../../utils/constant";
import AppliedJobsTable from "./AppliedJobsTable";
import useGetAppliedJobs from "../../hooks/useGetAppliedJobs";
import { Pencil, Phone, Mail, FileText, Tag, X, Loader2, Camera, Briefcase, Award, TrendingUp } from "lucide-react";

const EditModal = ({ user, onClose, onSave }) => {
  const [input, setInput] = useState({
    fullname: user.fullname || "", email: user.email || "",
    phoneNumber: user.phoneNumber || "", bio: user.profile?.bio || "",
    skills: user.profile?.skills?.join(", ") || "", file: null,
  });
  const [loading, setLoading] = useState(false);
  const change = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const save = async () => {
    const fd = new FormData();
    Object.entries(input).forEach(([k, v]) => { if (k !== "file" && v) fd.append(k, v); });
    if (input.file) fd.append("file", input.file);
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, fd, {
        headers: { "Content-Type": "multipart/form-data" }, withCredentials: true,
      });
      if (res.data.success) { onSave(res.data.user); toast.success("Profile updated!"); }
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"><X size={15}/></button>
        </div>
        <div className="space-y-4">
          {[["fullname","Full Name","text"],["email","Email","email"],["phoneNumber","Phone","number"]].map(([name,label,type]) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <input type={type} name={name} value={input[name]} onChange={change}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea name="bio" value={input.bio} onChange={change} rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="A short bio about yourself..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input name="skills" value={input.skills} onChange={change}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="React, Node.js, Python, MongoDB" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resume (PDF)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setInput({ ...input, file: e.target.files[0] })}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100 cursor-pointer" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button onClick={save} disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2 hover:from-purple-700 hover:to-violet-600 transition">
              {loading ? <><Loader2 className="animate-spin" size={14}/>Saving...</> : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  useGetAppliedJobs();
  const { user } = useSelector((s) => s.auth);
  const { allAppliedJobs } = useSelector((s) => s.job);
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);

  const handleSave = (u) => { dispatch(setUser(u)); setEditOpen(false); };

  const stats = [
    { label: "Applied", value: allAppliedJobs?.length || 0, icon: Briefcase, color: "bg-purple-50 text-purple-600" },
    { label: "Skills", value: user?.profile?.skills?.length || 0, icon: Award, color: "bg-blue-50 text-blue-600" },
    { label: "Profile", value: user?.profile?.bio ? "100%" : "60%", icon: TrendingUp, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize:"30px 30px"}} />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar + edit */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl ring-4 ring-white bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center overflow-hidden shadow-lg">
                  {user?.profile?.profilePhoto
                    ? <img src={user.profile.profilePhoto} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white font-extrabold text-3xl">{user?.fullname?.[0]?.toUpperCase()}</span>}
                </div>
              </div>
              <button onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition shadow-sm">
                <Pencil size={13}/> Edit Profile
              </button>
            </div>

            {/* Name & bio */}
            <h1 className="text-2xl font-extrabold text-gray-900">{user?.fullname}</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.profile?.bio || <span className="italic text-gray-300">No bio yet — click Edit Profile to add one</span>}</p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400"/>{user?.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400"/>+91 {user?.phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={18}/>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills + Resume */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-3 uppercase tracking-wide">
              <Award size={14} className="text-purple-500"/>Skills
            </h2>
            {user?.profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold border border-purple-100">{s}</span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Tag size={24} className="text-gray-200 mx-auto mb-2"/>
                <p className="text-sm text-gray-400">No skills added yet</p>
                <button onClick={() => setEditOpen(true)} className="text-xs text-purple-600 font-semibold mt-1 hover:underline">Add skills →</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-3 uppercase tracking-wide">
              <FileText size={14} className="text-purple-500"/>Resume
            </h2>
            {user?.profile?.resume ? (
              <a href={user.profile.resume} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition group">
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-red-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{user.profile.resumeOriginalName || "My Resume"}</p>
                  <p className="text-xs text-purple-600 font-semibold">Click to view →</p>
                </div>
              </a>
            ) : (
              <div className="text-center py-6">
                <FileText size={24} className="text-gray-200 mx-auto mb-2"/>
                <p className="text-sm text-gray-400">No resume uploaded</p>
                <button onClick={() => setEditOpen(true)} className="text-xs text-purple-600 font-semibold mt-1 hover:underline">Upload resume →</button>
              </div>
            )}
          </div>
        </div>

        {/* Applied Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <Briefcase size={14} className="text-purple-500"/>Applied Jobs
            </h2>
          </div>
          <div className="p-5"><AppliedJobsTable /></div>
        </div>
      </div>
      {editOpen && <EditModal user={user} onClose={() => setEditOpen(false)} onSave={handleSave} />}
    </div>
  );
};
export default Profile;