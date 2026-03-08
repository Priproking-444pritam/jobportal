import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/slices/jobSlice";
import { Search, X, SlidersHorizontal, MapPin, DollarSign, Briefcase, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import JobCard from "../components/job/JobCard";
import useGetAllJobs from "../hooks/useGetAllJobs";

const LOCATIONS = ["Remote","Bangalore, India","Hyderabad, India","Delhi, India","Mumbai, India","Pune, India","Noida, India"];
const JOB_TYPES = ["Full Time","Part Time","Contract","Internship"];
const SALARY_RANGES = [
  {label:"0–10 LPA",min:0,max:10},{label:"10–20 LPA",min:10,max:20},
  {label:"20–30 LPA",min:20,max:30},{label:"30–50 LPA",min:30,max:50},{label:"50+ LPA",min:50,max:9999},
];
const EXPERIENCE = [
  {label:"Fresher (0–1 yr)",min:0,max:1},{label:"Junior (1–3 yrs)",min:1,max:3},
  {label:"Mid (3–5 yrs)",min:3,max:5},{label:"Senior (5+ yrs)",min:5,max:99},
];

const FilterSection = ({ title, children, icon: Icon }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <Icon size={14} className="text-purple-500" />{title}
        </div>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5">
    <div className="flex gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 skeleton rounded-lg" /><div className="h-3 skeleton rounded-lg w-5/6" />
    </div>
    <div className="flex gap-2 mb-4">{[1,2,3].map(i=><div key={i} className="h-6 w-16 skeleton rounded-lg"/>)}</div>
    <div className="flex gap-4 pt-3 border-t border-gray-50">
      <div className="h-3 w-24 skeleton rounded-lg"/><div className="h-3 w-20 skeleton rounded-lg"/>
    </div>
  </div>
);

const Jobs = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector((s) => s.job);
  const [searchText, setSearchText] = useState(searchedQuery || "");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedExp, setSelectedExp] = useState(null);

  useEffect(() => {
    if (allJobs.length > 0) setLoading(false);
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [allJobs]);

  useEffect(() => {
    let jobs = [...allJobs];
    if (searchText) {
      const q = searchText.toLowerCase();
      jobs = jobs.filter((j) =>
        j.title?.toLowerCase().includes(q) || j.description?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) || j.company?.name?.toLowerCase().includes(q) ||
        j.requirements?.some((r) => r.toLowerCase().includes(q))
      );
    }
    if (selectedLocations.length > 0) jobs = jobs.filter((j) => selectedLocations.includes(j.location));
    if (selectedTypes.length > 0) jobs = jobs.filter((j) => selectedTypes.includes(j.jobType));
    if (selectedSalary) jobs = jobs.filter((j) => j.salary >= selectedSalary.min && j.salary <= selectedSalary.max);
    if (selectedExp) jobs = jobs.filter((j) => j.experienceLevel >= selectedExp.min && j.experienceLevel <= selectedExp.max);
    setFilteredJobs(jobs);
  }, [allJobs, searchText, selectedLocations, selectedTypes, selectedSalary, selectedExp]);

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  const clearAll = () => { setSearchText(""); setSelectedLocations([]); setSelectedTypes([]); setSelectedSalary(null); setSelectedExp(null); dispatch(setSearchedQuery("")); };
  const activeCount = selectedLocations.length + selectedTypes.length + (selectedSalary?1:0) + (selectedExp?1:0);

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Browse Jobs</h1>
          <p className="text-gray-500 text-sm">Showing <strong className="text-gray-800">{filteredJobs.length}</strong> of {allJobs.length} jobs</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 flex-1 px-4">
              <Search size={16} className="text-gray-400" />
              <input value={searchText} onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 py-3 text-sm focus:outline-none bg-transparent"
                placeholder="Search by title, skill, company, location..." />
              {searchText && <button onClick={() => setSearchText("")}><X size={15} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>
            <button className="px-5 m-1.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-violet-700 transition flex items-center gap-2">
              <Search size={14} />Search
            </button>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${showFilters?"bg-purple-600 text-white border-purple-600":"bg-white border-gray-200 text-gray-700"}`}>
            <SlidersHorizontal size={15} />
            {activeCount > 0 && <span className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">{activeCount}</span>}
          </button>
        </div>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLocations.map(l=><span key={l} className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full font-medium">{l}<button onClick={()=>toggle(selectedLocations,setSelectedLocations,l)}><X size={11}/></button></span>)}
            {selectedTypes.map(t=><span key={t} className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">{t}<button onClick={()=>toggle(selectedTypes,setSelectedTypes,t)}><X size={11}/></button></span>)}
            {selectedSalary&&<span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-medium">{selectedSalary.label}<button onClick={()=>setSelectedSalary(null)}><X size={11}/></button></span>}
            {selectedExp&&<span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-medium">{selectedExp.label}<button onClick={()=>setSelectedExp(null)}><X size={11}/></button></span>}
            <button onClick={clearAll} className="text-xs text-red-500 font-medium hover:underline px-1">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`w-60 flex-shrink-0 ${showFilters?"block":"hidden md:block"}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><SlidersHorizontal size={15} className="text-purple-500"/>Filters</h3>
                {activeCount>0&&<button onClick={clearAll} className="text-xs text-purple-600 font-semibold hover:underline">Clear</button>}
              </div>

              <FilterSection title="Location" icon={MapPin}>
                <div className="space-y-2">
                  {LOCATIONS.map(loc=>(
                    <label key={loc} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={selectedLocations.includes(loc)} onChange={()=>toggle(selectedLocations,setSelectedLocations,loc)} className="w-4 h-4 accent-purple-600 rounded"/>
                      <span className={`text-xs ${selectedLocations.includes(loc)?"text-purple-700 font-semibold":"text-gray-600"}`}>{loc}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Job Type" icon={Briefcase}>
                <div className="space-y-2">
                  {JOB_TYPES.map(type=>(
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={selectedTypes.includes(type)} onChange={()=>toggle(selectedTypes,setSelectedTypes,type)} className="w-4 h-4 accent-purple-600 rounded"/>
                      <span className={`text-xs ${selectedTypes.includes(type)?"text-purple-700 font-semibold":"text-gray-600"}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Salary Range" icon={DollarSign}>
                <div className="space-y-2">
                  {SALARY_RANGES.map(r=>(
                    <label key={r.label} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="salary" checked={selectedSalary?.label===r.label} onChange={()=>setSelectedSalary(selectedSalary?.label===r.label?null:r)} className="w-4 h-4 accent-purple-600"/>
                      <span className={`text-xs ${selectedSalary?.label===r.label?"text-purple-700 font-semibold":"text-gray-600"}`}>{r.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Experience" icon={TrendingUp}>
                <div className="space-y-2">
                  {EXPERIENCE.map(e=>(
                    <label key={e.label} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="exp" checked={selectedExp?.label===e.label} onChange={()=>setSelectedExp(selectedExp?.label===e.label?null:e)} className="w-4 h-4 accent-purple-600"/>
                      <span className={`text-xs ${selectedExp?.label===e.label?"text-purple-700 font-semibold":"text-gray-600"}`}>{e.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Job Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map(i=><SkeletonCard key={i}/>)}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="text-purple-300" size={24}/>
                </div>
                <h3 className="text-base font-bold text-gray-700 mb-1">No jobs found</h3>
                <p className="text-sm text-gray-400 mb-4">Try different keywords or clear your filters</p>
                <button onClick={clearAll} className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredJobs.map((job,i)=><JobCard key={job._id} job={job} index={i}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Jobs;