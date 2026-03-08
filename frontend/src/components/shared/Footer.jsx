import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-950 text-gray-400 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-500 rounded-xl flex items-center justify-center">
              <Briefcase className="text-white" size={17} />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">Job<span className="text-purple-400">Portal</span></span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
            India's smartest job portal with AI-powered matching. Connect with top companies and find your dream role.
          </p>
          <div className="flex gap-3 mt-5">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-purple-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">For Job Seekers</h4>
          <ul className="space-y-2.5 text-sm">
            {[["Browse Jobs", "/jobs"], ["Companies", "/companies"], ["Saved Jobs", "/saved-jobs"], ["My Profile", "/profile"]].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-purple-400 transition">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">For Recruiters</h4>
          <ul className="space-y-2.5 text-sm">
            {[["Dashboard", "/admin"], ["Post a Job", "/admin/jobs/create"], ["My Companies", "/admin/companies"], ["View Applicants", "/admin/jobs"]].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-purple-400 transition">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        <p className="flex items-center gap-1.5">Built with <Heart size={11} className="text-red-500 fill-red-500" /> using MERN Stack</p>
      </div>
    </div>
  </footer>
);
export default Footer;