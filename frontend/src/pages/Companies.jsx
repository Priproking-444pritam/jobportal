import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, MapPin, Globe, Users, Briefcase } from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const COMPANIES = [
  { name:"Google", logo:"https://img.icons8.com/color/96/google-logo.png", industry:"Technology", location:"Bangalore, India", size:"10,000+", description:"Search, AI, Cloud Platform", jobs:5, color:"#4285F4" },
  { name:"Microsoft", logo:"https://img.icons8.com/color/96/microsoft.png", industry:"Technology", location:"Hyderabad, India", size:"10,000+", description:"Software, Cloud, Devices", jobs:4, color:"#00A4EF" },
  { name:"Amazon", logo:"https://img.icons8.com/color/96/amazon.png", industry:"E-commerce", location:"Bangalore, India", size:"10,000+", description:"E-commerce, AWS, Logistics", jobs:4, color:"#FF9900" },
  { name:"Meta", logo:"https://img.icons8.com/color/96/meta.png", industry:"Social Media", location:"Mumbai, India", size:"10,000+", description:"Facebook, Instagram, WhatsApp", jobs:2, color:"#0082FB" },
  { name:"Netflix", logo:"https://img.icons8.com/color/96/netflix.png", industry:"Entertainment", location:"Remote", size:"5,000+", description:"Streaming Entertainment Platform", jobs:3, color:"#E50914" },
  { name:"Flipkart", logo:"https://img.icons8.com/color/96/flipkart.png", industry:"E-commerce", location:"Bangalore, India", size:"10,000+", description:"India's top e-commerce platform", jobs:5, color:"#2874F0" },
  { name:"Swiggy", logo:"https://img.icons8.com/color/96/swiggy.png", industry:"Food Tech", location:"Bangalore, India", size:"5,000+", description:"Food delivery platform", jobs:3, color:"#FC8019" },
  { name:"Zomato", logo:"https://img.icons8.com/color/96/zomato.png", industry:"Food Tech", location:"Delhi, India", size:"5,000+", description:"Food tech & restaurant platform", jobs:3, color:"#E23744" },
  { name:"Razorpay", logo:"https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/96/external-razorpay-an-indian-payment-gateway-company-logo-shadow-tal-revivo.png", industry:"Fintech", location:"Bangalore, India", size:"1,000+", description:"Payments infrastructure for India", jobs:3, color:"#3395FF" },
  { name:"Paytm", logo:"https://img.icons8.com/color/96/paytm.png", industry:"Fintech", location:"Noida, India", size:"10,000+", description:"Digital payments & financial services", jobs:3, color:"#002970" },
  { name:"LinkedIn", logo:"https://img.icons8.com/color/96/linkedin.png", industry:"Professional Network", location:"Bangalore, India", size:"5,000+", description:"Professional networking platform", jobs:3, color:"#0A66C2" },
  { name:"Spotify", logo:"https://img.icons8.com/color/96/spotify.png", industry:"Music Streaming", location:"Remote", size:"5,000+", description:"Music & podcast streaming", jobs:3, color:"#1DB954" },
];

const CompanyCard = ({ company }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 card-hover cursor-pointer group"
      onClick={() => navigate(`/jobs?company=${company.name}`)}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
          {company.logo && !imgError ? (
            <img src={company.logo} alt={company.name} onError={() => setImgError(true)} className="w-full h-full object-contain p-1.5" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-white text-lg rounded-xl" style={{ background: company.color }}>
              {company.name[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition truncate">{company.name}</h3>
          <p className="text-xs text-purple-600 font-semibold mt-0.5">{company.industry}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{company.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1"><MapPin size={11} />{company.location}</span>
        <span className="flex items-center gap-1"><Users size={11} />{company.size}</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
          <Briefcase size={10} /> {company.jobs} open roles
        </span>
        <span className="text-xs text-purple-600 font-semibold group-hover:underline">View Jobs →</span>
      </div>
    </div>
  );
};

const Companies = () => {
  const [search, setSearch] = useState("");
  const filtered = COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Top Companies Hiring</h1>
          <p className="text-gray-500 text-sm">Discover world-class teams and find your next opportunity</p>
        </div>
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 py-3 text-sm focus:outline-none bg-transparent"
              placeholder="Search companies or industry..." />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => <CompanyCard key={company.name} company={company} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Companies;