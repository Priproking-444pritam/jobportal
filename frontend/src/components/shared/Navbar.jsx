import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/slices/authSlice";
import { USER_API_END_POINT } from "../../utils/constant";
import { LogOut, User, Menu, X, Briefcase, Bookmark, LayoutDashboard, ChevronDown, Sun, Moon, FileSearch } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const { savedJobs } = useSelector((s) => s.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) { dispatch(setUser(null)); navigate("/"); toast.success("Logged out"); }
    } catch { toast.error("Logout failed"); }
  };

  const active = (path) => location.pathname === path
    ? "bg-purple-50 text-purple-700 font-semibold dark:bg-purple-900/30 dark:text-purple-300"
    : "text-gray-600 hover:text-purple-700 hover:bg-purple-50/60 font-medium dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900/20";

  const studentLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/companies", label: "Companies" },
    { to: "/resume-analyser", label: "AI Resume" },
  ];
  const recruiterLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/companies", label: "Companies" },
    { to: "/admin/jobs", label: "My Jobs" },
  ];
  const links = user?.role === "recruiter" ? recruiterLinks : studentLinks;

  return (
    <nav className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-500 rounded-xl flex items-center justify-center shadow-sm shadow-purple-200 group-hover:shadow-purple-300 transition-shadow">
              <Briefcase className="text-white" size={17} />
            </div>
            <span className="text-[1.15rem] font-extrabold tracking-tight text-gray-900 dark:text-white">
              Job<span className="gradient-text">Portal</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm transition-all ${active(to)}`}>
                {Icon && <Icon size={14} />}{label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark mode toggle — Moon = go dark, Sun = go light */}
            <button onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 transition">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-purple-700 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded-lg transition">Login</Link>
                <Link to="/signup" className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-violet-500 rounded-xl shadow-sm shadow-purple-200 hover:shadow-purple-300 hover:from-purple-700 hover:to-violet-600 transition-all">
                  Get Started →
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {user.role === "student" && (
                  <Link to="/saved-jobs" title="Saved Jobs"
                    className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 transition">
                    <Bookmark size={17} />
                    {savedJobs?.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {savedJobs.length}
                      </span>
                    )}
                  </Link>
                )}
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-gray-900">
                      {user.profile?.profilePhoto
                        ? <img src={user.profile.profilePhoto} alt="" className="w-full h-full object-cover" />
                        : <span className="text-white font-bold text-sm">{user.fullname?.[0]?.toUpperCase()}</span>}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-[90px] truncate">{user.fullname}</span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-b border-purple-100 dark:border-purple-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.fullname}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <span className="mt-1.5 inline-block bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {user.role === "student" ? "Job Seeker" : "Recruiter"}
                        </span>
                      </div>
                      {user.role === "student" && (
                        <>
                          <Link to="/profile" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition">
                            <User size={14} /> My Profile
                          </Link>
                          <Link to="/resume-analyser" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition">
                            <FileSearch size={14} /> AI Resume Analyser
                          </Link>
                        </>
                      )}
                      {user.role === "recruiter" && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition">
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                      )}
                      <button onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition border-t border-gray-50 dark:border-gray-800">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {menuOpen ? <X size={20} className="dark:text-white" /> : <Menu size={20} className="dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pt-3 pb-4 space-y-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition ${active(to)}`}>{label}</Link>
          ))}
          {!user ? (
            <div className="pt-2 flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-violet-500 rounded-xl">Get Started</Link>
            </div>
          ) : (
            <>
              {user.role === "student" && <Link to="/saved-jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20"><Bookmark size={15}/>Saved Jobs</Link>}
              {user.role === "student" && <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20"><User size={15}/>Profile</Link>}
              {user.role === "student" && <Link to="/resume-analyser" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20"><FileSearch size={15}/>AI Resume</Link>}
              <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"><LogOut size={15}/>Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;