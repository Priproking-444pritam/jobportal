import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Briefcase, Building2, Users, TrendingUp, Plus, ArrowRight, Eye } from "lucide-react";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import Navbar from "../shared/Navbar";

const COLORS = ["#6A38C2","#a855f7","#8b5cf6","#7c3aed","#4f46e5","#4338ca"];

const StatCard = ({ label, value, icon: Icon, color, sub, onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm ${onClick?"cursor-pointer card-hover":""}`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      {onClick && <ArrowRight size={16} className="text-gray-300" />}
    </div>
    <div className="text-3xl font-extrabold text-gray-900 mb-0.5">{value}</div>
    <div className="text-sm font-semibold text-gray-600">{label}</div>
    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  useGetAllAdminJobs();
  useGetAllCompanies();
  const navigate = useNavigate();
  const { allAdminJobs } = useSelector((s) => s.job);
  const { companies } = useSelector((s) => s.company);

  const totalApplications = allAdminJobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0);

  // Chart data: applications per job (top 6)
  const appChartData = allAdminJobs
    .slice(0, 6)
    .map((j) => ({ name: j.title.split(" ").slice(0, 2).join(" "), apps: j.applications?.length || 0 }));

  // Pie chart: jobs by type
  const typeCount = allAdminJobs.reduce((acc, j) => {
    acc[j.jobType] = (acc[j.jobType] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

  // Jobs by company
  const companyJobCount = allAdminJobs.reduce((acc, j) => {
    const name = j.company?.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const companyData = Object.entries(companyJobCount).slice(0, 6).map(([name, jobs]) => ({ name: name.split(" ")[0], jobs }));

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Overview of your hiring activity</p>
          </div>
          <button onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-violet-700 transition shadow-sm">
            <Plus size={16} /> Post New Job
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Jobs" value={allAdminJobs.length} icon={Briefcase} color="bg-purple-50 text-purple-600" sub="Posted by you" onClick={() => navigate("/admin/jobs")} />
          <StatCard label="Companies" value={companies.length} icon={Building2} color="bg-blue-50 text-blue-600" sub="Registered" onClick={() => navigate("/admin/companies")} />
          <StatCard label="Applications" value={totalApplications} icon={Users} color="bg-green-50 text-green-600" sub="Total received" />
          <StatCard label="Avg Applications" value={allAdminJobs.length ? (totalApplications / allAdminJobs.length).toFixed(1) : 0} icon={TrendingUp} color="bg-amber-50 text-amber-600" sub="Per job" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Applications per Job</h3>
            <p className="text-xs text-gray-400 mb-4">Top 6 most applied positions</p>
            {appChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={appChartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                  <Bar dataKey="apps" fill="#6A38C2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Post jobs to see chart data</div>
            )}
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Jobs by Type</h3>
            <p className="text-xs text-gray-400 mb-4">Distribution breakdown</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" outerRadius={75} dataKey="value" label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Jobs by company bar */}
        {companyData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Jobs by Company</h3>
            <p className="text-xs text-gray-400 mb-4">Number of open positions per company</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={companyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="jobs" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Jobs Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Recent Jobs</h3>
            <button onClick={() => navigate("/admin/jobs")} className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          {allAdminJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Briefcase size={28} className="mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No jobs posted yet</p>
              <button onClick={() => navigate("/admin/jobs/create")} className="mt-3 text-xs text-purple-600 font-semibold hover:underline">Post your first job →</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Job Title","Company","Location","Applications","Date"].map(h=>(
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allAdminJobs.slice(0, 8).map((job) => (
                  <tr key={job._id} className="hover:bg-purple-50/30 transition cursor-pointer" onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">{job.title}</td>
                    <td className="px-5 py-3.5 text-gray-500">{job.company?.name}</td>
                    <td className="px-5 py-3.5 text-gray-500">{job.location}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-purple-50 text-purple-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                        {job.applications?.length || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(job.createdAt).toLocaleDateString()}</td>
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
export default AdminDashboard;