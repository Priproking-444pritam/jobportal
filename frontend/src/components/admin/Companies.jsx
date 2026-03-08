import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Plus, Search, Building2 } from "lucide-react";
import Navbar from "../shared/Navbar";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";

const Companies = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [filterText, setFilterText] = useState("");
  const filtered = companies.filter((c) => c.name.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-500 text-sm mt-1">{companies.length} companies registered</p>
          </div>
          <button onClick={() => navigate("/admin/companies/create")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
            <Plus className="w-4 h-4" /> New Company
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Filter companies..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm">No companies found. Create your first one!</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Logo</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => (
                  <tr key={company._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center overflow-hidden">
                        {company.logo ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                          : <span className="text-purple-700 font-bold text-sm">{company.name?.[0]?.toUpperCase()}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{company.name}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="text-xs text-purple-600 font-semibold hover:underline">Edit</button>
                    </td>
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
export default Companies;
