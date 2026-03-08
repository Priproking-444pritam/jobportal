import React from "react";
import { useSelector } from "react-redux";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  accepted: "bg-green-50 text-green-700 border border-green-100",
  rejected: "bg-red-50 text-red-700 border border-red-100",
};

const AppliedJobsTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">You haven't applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Job</th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Company</th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody>
          {allAppliedJobs.map((app) => (
            <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
              <td className="py-3 px-2 text-gray-500">{new Date(app?.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-2 font-medium text-gray-800">{app?.job?.title}</td>
              <td className="py-3 px-2 text-gray-500">{app?.job?.company?.name}</td>
              <td className="py-3 px-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${statusColors[app?.status] || statusColors.pending}`}>
                  {app?.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AppliedJobsTable;
