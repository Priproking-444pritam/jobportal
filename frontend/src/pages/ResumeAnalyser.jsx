import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Upload, FileText, Sparkles, CheckCircle, AlertCircle, XCircle,
  TrendingUp, Target, Zap, Award, ChevronDown, ChevronUp,
  Briefcase, BookOpen, User, Code, Star, ArrowRight, RotateCcw
} from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { RESUME_API_END_POINT } from "../utils/constant";

const ScoreRing = ({ score, label, size = 120 }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-700" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="text-center -mt-[calc(60px+0.5rem)] mb-[calc(60px-0.5rem)] relative" style={{marginTop: `-${size/2 + 8}px`, marginBottom: `${size/2 - 8}px`}}>
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{score}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{label}</div>
      </div>
    </div>
  );
};

const ScoreCircle = ({ score, label }) => {
  const color = score >= 70 ? "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    : score >= 50 ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
    : "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  return (
    <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 ${color}`}>
      <div className="text-3xl font-extrabold">{score}</div>
      <div className="text-xs font-semibold text-center px-1 leading-tight mt-0.5">{label}</div>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    Low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${styles[priority] || styles.Low}`}>{priority}</span>;
};

const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
        <div className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-white">
          <Icon size={16} className="text-purple-500" />{title}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-50 dark:border-gray-800 pt-4">{children}</div>}
    </div>
  );
};

const ResumeAnalyser = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileRef = useRef();

  const loadingSteps = [
    "Extracting text from PDF...",
    "Reading your resume...",
    "Analysing skills and experience...",
    "Generating AI feedback...",
    "Preparing your report...",
  ];

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5MB"); return; }
    setFile(f);
    setAnalysis(null);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyse = async () => {
    if (!file) { toast.error("Please upload your resume first"); return; }
    if (!user) { toast.error("Please login to use this feature"); navigate("/login"); return; }

    setLoading(true); setLoadingStep(0);
    const interval = setInterval(() => setLoadingStep((s) => Math.min(s + 1, loadingSteps.length - 1)), 1800);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post(`${RESUME_API_END_POINT}/analyse`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        toast.success("Analysis complete! 🎉");
        setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      clearInterval(interval); setLoading(false);
    }
  };

  const reset = () => { setFile(null); setAnalysis(null); };

  const scoreColor = (s) => s >= 70 ? "text-green-600 dark:text-green-400" : s >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
  const scoreBg = (s) => s >= 70 ? "bg-green-50 dark:bg-green-900/20" : s >= 50 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-red-50 dark:bg-red-900/20";

  return (
    <div className="min-h-screen bg-[#f8f7ff] dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkles size={13} /> Powered by Claude AI
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            AI Resume <span className="gradient-text">Analyser</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Upload your resume and get instant AI-powered feedback — score, strengths, improvements, ATS compatibility, and job role suggestions.
          </p>
        </div>

        {/* Upload Zone */}
        {!analysis && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragOver ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20" :
                file ? "border-green-400 bg-green-50 dark:bg-green-900/10 cursor-default" :
                "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
              }`}>
              <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                    <FileText className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <XCircle size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <Upload className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 dark:text-gray-200">Drop your resume here</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">or click to browse · PDF only · Max 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {file && !loading && (
              <button onClick={analyse}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all shadow-sm shadow-purple-200 flex items-center justify-center gap-2 text-sm">
                <Sparkles size={16} /> Analyse Resume →
              </button>
            )}

            {loading && (
              <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0" style={{borderWidth:"3px"}} />
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">{loadingSteps[loadingStep]}</p>
                </div>
                <div className="w-full bg-purple-100 dark:bg-purple-900/40 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div id="results" className="space-y-5">
            {/* Reset button */}
            <div className="flex justify-end">
              <button onClick={reset}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition">
                <RotateCcw size={14} /> Analyse another resume
              </button>
            </div>

            {/* Score Overview */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Big score */}
                <div className="flex-shrink-0 text-center">
                  <div className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-4 ${
                    analysis.overallScore >= 70 ? "border-green-400 bg-green-50 dark:bg-green-900/20" :
                    analysis.overallScore >= 50 ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20" :
                    "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
                    <span className={`text-4xl font-extrabold ${scoreColor(analysis.overallScore)}`}>{analysis.overallScore}</span>
                    <span className={`text-xs font-bold mt-1 ${scoreColor(analysis.overallScore)}`}>{analysis.scoreLabel}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Overall Score</p>
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">Resume Analysis Complete</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{analysis.summary}</p>
                  <div className="flex gap-3 flex-wrap">
                    <ScoreCircle score={analysis.atsScore} label="ATS Score" />
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">ATS Compatibility</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{analysis.atsFeedback}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Skills */}
            {analysis.extractedSkills?.length > 0 && (
              <Section title="Skills Detected in Your Resume" icon={Code}>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800 rounded-xl text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Strengths */}
            {analysis.strengths?.length > 0 && (
              <Section title={`Strengths (${analysis.strengths.length})`} icon={CheckCircle}>
                <div className="space-y-3">
                  {analysis.strengths.map((s, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{s.point}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Improvements */}
            {analysis.improvements?.length > 0 && (
              <Section title={`Areas to Improve (${analysis.improvements.length})`} icon={AlertCircle}>
                <div className="space-y-3">
                  {analysis.improvements.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{item.point}</p>
                          <PriorityBadge priority={item.priority} />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Section Feedback */}
            {analysis.sectionFeedback && (
              <Section title="Section-by-Section Feedback" icon={BookOpen}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(analysis.sectionFeedback).map(([key, val]) => (
                    <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1 capitalize">{key}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Suggested Roles + Missing Keywords */}
            <div className="grid sm:grid-cols-2 gap-5">
              {analysis.suggestedRoles?.length > 0 && (
                <Section title="Best Fit Roles" icon={Briefcase} defaultOpen={true}>
                  <div className="space-y-2">
                    {analysis.suggestedRoles.map((role, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <Star size={12} className="text-purple-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{role}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/jobs")}
                    className="w-full mt-3 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    Browse These Jobs <ArrowRight size={14} />
                  </button>
                </Section>
              )}

              {analysis.missingKeywords?.length > 0 && (
                <Section title="Missing Keywords" icon={Target} defaultOpen={true}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Add these to your resume to improve ATS ranking:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 rounded-lg text-xs font-semibold">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-center">
              <h3 className="text-white font-extrabold text-lg mb-2">Ready to apply?</h3>
              <p className="text-purple-200 text-sm mb-4">Browse jobs that match your profile and skill set</p>
              <button onClick={() => navigate("/jobs")}
                className="bg-white text-purple-700 font-bold px-6 py-2.5 rounded-xl hover:bg-purple-50 transition text-sm">
                Browse Matching Jobs →
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default ResumeAnalyser;