import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/user.model.js";
import Company from "./models/company.model.js";
import Job from "./models/job.model.js";
import bcrypt from "bcryptjs";

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB");

await Job.deleteMany({});
await Company.deleteMany({});
await User.deleteMany({ email: "recruiter@seed.com" });

const hashedPassword = await bcrypt.hash("password123", 10);
const recruiter = await User.create({
  fullname: "Demo Recruiter",
  email: "recruiter@seed.com",
  phoneNumber: 9999999999,
  password: hashedPassword,
  role: "recruiter",
  profile: {},
});

// Using Google's favicon service + direct SVG logos (always free, always works)
const companiesData = [
  {
    name: "Google",
    logo: "https://www.google.com/favicon.ico",
    location: "Bangalore, India",
    website: "https://google.com",
    description: "Search, AI, and Cloud",
    color: "#4285F4",
  },
  {
    name: "Microsoft",
    logo: "https://img.icons8.com/color/96/microsoft.png",
    location: "Hyderabad, India",
    website: "https://microsoft.com",
    description: "Software and Cloud",
    color: "#00A4EF",
  },
  {
    name: "Amazon",
    logo: "https://img.icons8.com/color/96/amazon.png",
    location: "Bangalore, India",
    website: "https://amazon.com",
    description: "E-commerce and AWS",
    color: "#FF9900",
  },
  {
    name: "Meta",
    logo: "https://img.icons8.com/color/96/meta.png",
    location: "Mumbai, India",
    website: "https://meta.com",
    description: "Social Media and VR",
    color: "#0082FB",
  },
  {
    name: "Netflix",
    logo: "https://img.icons8.com/color/96/netflix.png",
    location: "Remote",
    website: "https://netflix.com",
    description: "Streaming Platform",
    color: "#E50914",
  },
  {
    name: "Flipkart",
    logo: "https://img.icons8.com/color/96/flipkart.png",
    location: "Bangalore, India",
    website: "https://flipkart.com",
    description: "E-commerce",
    color: "#2874F0",
  },
  {
    name: "Infosys",
    logo: "https://img.icons8.com/color/96/infosys.png",
    location: "Pune, India",
    website: "https://infosys.com",
    description: "IT Services",
    color: "#007CC3",
  },
  {
    name: "Razorpay",
    logo: "https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/96/external-razorpay-an-indian-payment-gateway-company-logo-shadow-tal-revivo.png",
    location: "Bangalore, India",
    website: "https://razorpay.com",
    description: "Fintech",
    color: "#3395FF",
  },
  {
    name: "Swiggy",
    logo: "https://img.icons8.com/color/96/swiggy.png",
    location: "Bangalore, India",
    website: "https://swiggy.com",
    description: "Food Delivery",
    color: "#FC8019",
  },
  {
    name: "Zomato",
    logo: "https://img.icons8.com/color/96/zomato.png",
    location: "Delhi, India",
    website: "https://zomato.com",
    description: "Food Tech",
    color: "#E23744",
  },
  {
    name: "Paytm",
    logo: "https://img.icons8.com/color/96/paytm.png",
    location: "Noida, India",
    website: "https://paytm.com",
    description: "Digital Payments",
    color: "#002970",
  },
  {
    name: "Uber",
    logo: "https://img.icons8.com/color/96/uber.png",
    location: "Hyderabad, India",
    website: "https://uber.com",
    description: "Ride Sharing",
    color: "#000000",
  },
  {
    name: "Atlassian",
    logo: "https://img.icons8.com/color/96/atlassian.png",
    location: "Remote",
    website: "https://atlassian.com",
    description: "Dev Tools",
    color: "#0052CC",
  },
  {
    name: "Adobe",
    logo: "https://img.icons8.com/color/96/adobe.png",
    location: "Noida, India",
    website: "https://adobe.com",
    description: "Creative Software",
    color: "#FF0000",
  },
  {
    name: "Salesforce",
    logo: "https://img.icons8.com/color/96/salesforce.png",
    location: "Hyderabad, India",
    website: "https://salesforce.com",
    description: "CRM Platform",
    color: "#00A1E0",
  },
  {
    name: "Spotify",
    logo: "https://img.icons8.com/color/96/spotify.png",
    location: "Remote",
    website: "https://spotify.com",
    description: "Music Streaming",
    color: "#1DB954",
  },
  {
    name: "Airbnb",
    logo: "https://img.icons8.com/color/96/airbnb.png",
    location: "Remote",
    website: "https://airbnb.com",
    description: "Travel & Hospitality",
    color: "#FF5A5F",
  },
  {
    name: "LinkedIn",
    logo: "https://img.icons8.com/color/96/linkedin.png",
    location: "Bangalore, India",
    website: "https://linkedin.com",
    description: "Professional Network",
    color: "#0A66C2",
  },
  {
    name: "Wipro",
    logo: "https://img.icons8.com/color/96/wipro.png",
    location: "Bangalore, India",
    website: "https://wipro.com",
    description: "IT Services",
    color: "#341C73",
  },
  {
    name: "Twitter",
    logo: "https://img.icons8.com/color/96/twitter.png",
    location: "Remote",
    website: "https://twitter.com",
    description: "Social Media",
    color: "#1DA1F2",
  },
];

const companies = await Company.insertMany(
  companiesData.map((c) => ({ ...c, userId: recruiter._id }))
);

const co = {};
companies.forEach((c) => { co[c.name] = c._id; });

const jobs = [
  // ── FRONTEND DEVELOPER (5) ──────────────────────────────
  { title: "Frontend Developer", description: "Build and maintain Google's consumer web applications. Work with React, TypeScript, and modern web technologies to create pixel-perfect UIs used by billions worldwide.", requirements: ["React", "TypeScript", "CSS", "REST APIs", "Git"], salary: 25, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Google"] },
  { title: "Senior Frontend Engineer", description: "Lead frontend development for Microsoft's Azure portal. Architect scalable component libraries, mentor junior devs, and drive UI performance improvements across the platform.", requirements: ["React", "Redux", "Azure", "Jest", "TypeScript"], salary: 35, experienceLevel: 4, location: "Hyderabad, India", jobType: "Full Time", position: 2, company: co["Microsoft"] },
  { title: "Frontend Engineer – Shopping", description: "Own Flipkart's product listing and checkout pages. Optimize Core Web Vitals and handle millions of concurrent users during Big Billion Days sale.", requirements: ["React", "Next.js", "Webpack", "Performance Optimization", "A/B Testing"], salary: 22, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 4, company: co["Flipkart"] },
  { title: "UI Engineer", description: "Build Swiggy's customer-facing web experience from order placement to real-time delivery tracking. Fast-paced team shipping features every week.", requirements: ["React", "JavaScript", "CSS Modules", "GraphQL", "Figma"], salary: 20, experienceLevel: 1, location: "Bangalore, India", jobType: "Full Time", position: 5, company: co["Swiggy"] },
  { title: "Frontend Developer – Payments", description: "Build Razorpay's merchant dashboard and payment checkout used by 8M+ businesses. Focus on security, accessibility, and seamless payment flows.", requirements: ["React", "TypeScript", "Web Security", "Accessibility", "Storybook"], salary: 24, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Razorpay"] },

  // ── BACKEND DEVELOPER (5) ───────────────────────────────
  { title: "Backend Developer", description: "Design and build scalable APIs powering Microsoft's cloud products. Work with Node.js and Go handling millions of requests per second in distributed systems.", requirements: ["Node.js", "Go", "PostgreSQL", "Docker", "Kubernetes"], salary: 28, experienceLevel: 3, location: "Hyderabad, India", jobType: "Full Time", position: 5, company: co["Microsoft"] },
  { title: "Backend Engineer – Logistics", description: "Build and scale Amazon's delivery and logistics APIs. Design fault-tolerant microservices coordinating warehouse, delivery, and tracking systems globally.", requirements: ["Java", "Spring Boot", "DynamoDB", "SQS", "AWS"], salary: 32, experienceLevel: 3, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Amazon"] },
  { title: "Software Engineer – Backend", description: "Join Zomato's restaurant platform team. Build APIs powering restaurant onboarding, menu management, and order fulfillment for 300k+ restaurant partners.", requirements: ["Python", "Django", "MySQL", "Redis", "Celery"], salary: 18, experienceLevel: 2, location: "Delhi, India", jobType: "Full Time", position: 4, company: co["Zomato"] },
  { title: "Backend Engineer – Payments", description: "Work on Paytm's core payments backend processing 1B+ transactions annually. Build high-throughput low-latency services for UPI, wallets, and bank transfers.", requirements: ["Java", "Kafka", "MySQL", "Redis", "Microservices"], salary: 20, experienceLevel: 2, location: "Noida, India", jobType: "Full Time", position: 6, company: co["Paytm"] },
  { title: "Senior Backend Engineer", description: "Lead backend development at Atlassian for Jira's issue tracking engine. Own high-scale services used by 200k+ companies including NASA and Tesla.", requirements: ["Java", "Spring", "PostgreSQL", "Elasticsearch", "AWS"], salary: 38, experienceLevel: 5, location: "Remote", jobType: "Full Time", position: 2, company: co["Atlassian"] },

  // ── FULL STACK (5) ──────────────────────────────────────
  { title: "Full Stack Engineer", description: "Join Amazon's core shopping team. Own features end-to-end from React frontends to Java microservices, serving hundreds of millions of customers worldwide.", requirements: ["React", "Java", "Spring Boot", "AWS", "MySQL"], salary: 30, experienceLevel: 3, location: "Remote", jobType: "Full Time", position: 2, company: co["Amazon"] },
  { title: "Full Stack Developer", description: "Build Swiggy's restaurant partner portal and internal ops tools. Work across React and Node.js to ship features that directly impact restaurant revenue.", requirements: ["React", "Node.js", "MongoDB", "Express", "Docker"], salary: 22, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 4, company: co["Swiggy"] },
  { title: "Full Stack Engineer – Growth", description: "Drive user acquisition at Spotify. Build A/B experiments, referral flows, and personalization features using React and Python across web and API layers.", requirements: ["React", "Python", "FastAPI", "PostgreSQL", "A/B Testing"], salary: 36, experienceLevel: 3, location: "Remote", jobType: "Full Time", position: 3, company: co["Spotify"] },
  { title: "Full Stack Developer", description: "Build LinkedIn's feed and messaging features used by 900M professionals. Work on React frontends and Java/Scala backends at massive scale.", requirements: ["React", "Java", "Scala", "Kafka", "REST APIs"], salary: 34, experienceLevel: 3, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["LinkedIn"] },
  { title: "Full Stack Engineer", description: "Work on Airbnb's host and guest experience. Build booking flows, search features, and host tools that power 4M+ listings worldwide.", requirements: ["React", "Ruby on Rails", "GraphQL", "PostgreSQL", "Redis"], salary: 40, experienceLevel: 4, location: "Remote", jobType: "Full Time", position: 2, company: co["Airbnb"] },

  // ── DATA SCIENTIST (5) ──────────────────────────────────
  { title: "Data Scientist", description: "Improve Netflix's recommendation engine using ML and data analysis. Work with Python and TensorFlow on petabytes of streaming data to personalize content for 260M subscribers.", requirements: ["Python", "TensorFlow", "SQL", "Machine Learning", "Spark"], salary: 35, experienceLevel: 4, location: "Remote", jobType: "Full Time", position: 2, company: co["Netflix"] },
  { title: "Data Scientist – Ads", description: "Build ML models powering Google's advertising platform. Work on click-through rate prediction, auction systems, and ad targeting generating $200B+ in annual revenue.", requirements: ["Python", "TensorFlow", "BigQuery", "Statistics", "A/B Testing"], salary: 42, experienceLevel: 4, location: "Hyderabad, India", jobType: "Full Time", position: 2, company: co["Google"] },
  { title: "Data Scientist – Forecasting", description: "Build forecasting models to help Zomato predict food demand, optimize delivery allocation, and reduce customer wait times across 800 cities.", requirements: ["Python", "Scikit-learn", "Time Series", "SQL", "Airflow"], salary: 22, experienceLevel: 2, location: "Delhi, India", jobType: "Full Time", position: 3, company: co["Zomato"] },
  { title: "ML Engineer", description: "Work on Google's AI products including Search, Translate, and Assistant. Train and deploy large-scale ML models serving billions of queries daily.", requirements: ["Python", "PyTorch", "MLOps", "TensorFlow", "Data Pipelines"], salary: 40, experienceLevel: 4, location: "Hyderabad, India", jobType: "Full Time", position: 2, company: co["Google"] },
  { title: "Data Scientist – Risk", description: "Build fraud detection and credit risk models at Razorpay. Use ML to protect merchants and customers from fraudulent transactions in real time.", requirements: ["Python", "XGBoost", "SQL", "Feature Engineering", "Statistics"], salary: 28, experienceLevel: 3, location: "Bangalore, India", jobType: "Full Time", position: 2, company: co["Razorpay"] },

  // ── UI/UX DESIGNER (5) ──────────────────────────────────
  { title: "UI/UX Designer", description: "Design beautiful, accessible interfaces for Infosys's enterprise clients. Create wireframes, prototypes, and design systems used across Fortune 500 products.", requirements: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"], salary: 18, experienceLevel: 2, location: "Pune, India", jobType: "Full Time", position: 2, company: co["Infosys"] },
  { title: "Product Designer", description: "Own end-to-end design of Adobe's Creative Cloud mobile apps. Work with PMs and engineers to ship delightful experiences for 30M+ creative professionals.", requirements: ["Figma", "Motion Design", "User Testing", "Interaction Design", "Design Systems"], salary: 32, experienceLevel: 3, location: "Noida, India", jobType: "Full Time", position: 2, company: co["Adobe"] },
  { title: "UX Designer – Consumer", description: "Design Flipkart's mobile shopping experience for India's next billion internet users. Conduct user research, create prototypes, and run usability studies.", requirements: ["Figma", "User Research", "Wireframing", "Usability Testing", "Mobile Design"], salary: 20, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Flipkart"] },
  { title: "Senior UX Designer", description: "Lead design for LinkedIn's job search and recruiter products used by 900M professionals. Define design vision and mentor a team of 3 designers.", requirements: ["Figma", "Design Leadership", "Complex UX", "Stakeholder Management", "Research"], salary: 35, experienceLevel: 5, location: "Bangalore, India", jobType: "Full Time", position: 1, company: co["LinkedIn"] },
  { title: "UI Designer", description: "Create stunning visual designs for Spotify's web and desktop app. Maintain and evolve Spotify's design system used by 200+ designers and engineers globally.", requirements: ["Figma", "Visual Design", "Design Systems", "CSS", "Illustration"], salary: 28, experienceLevel: 3, location: "Remote", jobType: "Full Time", position: 2, company: co["Spotify"] },

  // ── DEVOPS ENGINEER (5) ─────────────────────────────────
  { title: "DevOps Engineer", description: "Manage and scale Flipkart's infrastructure handling millions of daily transactions. Own CI/CD pipelines, Kubernetes clusters, and cloud cost optimization.", requirements: ["AWS", "Kubernetes", "Terraform", "Jenkins", "Linux"], salary: 22, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Flipkart"] },
  { title: "Site Reliability Engineer", description: "Maintain Google's 99.99% uptime SLA across global infrastructure. Build automation, improve observability, and lead incident response for production systems.", requirements: ["Kubernetes", "Prometheus", "Go", "Python", "GCP"], salary: 38, experienceLevel: 4, location: "Hyderabad, India", jobType: "Full Time", position: 2, company: co["Google"] },
  { title: "DevOps Engineer – Cloud", description: "Build Wipro's internal cloud platform used by 200,000+ employees. Automate infrastructure provisioning and manage multi-cloud deployments for enterprise clients.", requirements: ["Azure", "Terraform", "Docker", "Ansible", "Python"], salary: 16, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 5, company: co["Wipro"] },
  { title: "Cloud Solutions Architect", description: "Help Microsoft's enterprise customers design and migrate to Azure. Provide technical guidance on architecture, security, and cost optimization for large-scale projects.", requirements: ["Azure", "AWS", "Cloud Architecture", "Networking", "Security"], salary: 45, experienceLevel: 6, location: "Remote", jobType: "Full Time", position: 2, company: co["Microsoft"] },
  { title: "Infrastructure Engineer", description: "Build infrastructure powering Uber's real-time ride matching for 100M+ monthly trips. Work on low-latency services, global deployments, and chaos engineering.", requirements: ["Kubernetes", "AWS", "Go", "Terraform", "Observability"], salary: 36, experienceLevel: 4, location: "Hyderabad, India", jobType: "Full Time", position: 2, company: co["Uber"] },

  // ── PRODUCT MANAGER (5) ─────────────────────────────────
  { title: "Product Manager", description: "Lead product strategy for Amazon's logistics platform. Define roadmaps, work with engineering and design, and ship features improving delivery experience for millions.", requirements: ["Product Strategy", "Agile", "Data Analysis", "Stakeholder Management", "SQL"], salary: 38, experienceLevel: 5, location: "Delhi, India", jobType: "Full Time", position: 1, company: co["Amazon"] },
  { title: "Product Manager – Growth", description: "Drive Zomato's user acquisition and retention strategy. Own the growth funnel from install to first order, running experiments impacting millions of monthly users.", requirements: ["Growth Hacking", "SQL", "A/B Testing", "Funnel Analysis", "Product Roadmap"], salary: 28, experienceLevel: 3, location: "Delhi, India", jobType: "Full Time", position: 2, company: co["Zomato"] },
  { title: "Senior Product Manager", description: "Own Salesforce's CRM mobile product used by 150k+ enterprise companies. Define the 3-year product vision and lead a cross-functional team.", requirements: ["Enterprise SaaS", "Mobile Product", "Customer Research", "OKRs", "Leadership"], salary: 45, experienceLevel: 6, location: "Hyderabad, India", jobType: "Full Time", position: 1, company: co["Salesforce"] },
  { title: "Product Manager – Payments", description: "Define product strategy for Paytm's merchant payments suite. Own the roadmap for QR, POS, and payment gateway products used by 25M+ merchants.", requirements: ["Fintech", "Payments Domain", "SQL", "User Research", "Roadmapping"], salary: 30, experienceLevel: 4, location: "Noida, India", jobType: "Full Time", position: 2, company: co["Paytm"] },
  { title: "Associate Product Manager", description: "Kickstart your PM career at LinkedIn. Work on feed relevance and notification systems, run A/B tests, and ship features to 900M professional users.", requirements: ["Analytical Thinking", "SQL", "Communication", "User Empathy", "Agile"], salary: 22, experienceLevel: 1, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["LinkedIn"] },

  // ── MOBILE DEVELOPER (5) ────────────────────────────────
  { title: "React Native Developer", description: "Build Meta's mobile apps used by billions. Work on Facebook, Instagram, and WhatsApp mobile experiences using React Native and native modules.", requirements: ["React Native", "JavaScript", "Redux", "iOS", "Android"], salary: 32, experienceLevel: 3, location: "Mumbai, India", jobType: "Full Time", position: 4, company: co["Meta"] },
  { title: "Android Developer", description: "Build Flipkart's Android app used by 100M+ users. Own features end-to-end from Kotlin code to Play Store release with focus on performance.", requirements: ["Kotlin", "Android SDK", "Jetpack Compose", "MVVM", "Firebase"], salary: 20, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Flipkart"] },
  { title: "iOS Developer", description: "Build Swiggy's iOS app delivering food to millions. Own order tracking, restaurant discovery, and live location features in Swift.", requirements: ["Swift", "SwiftUI", "Core Data", "Push Notifications", "MapKit"], salary: 24, experienceLevel: 2, location: "Bangalore, India", jobType: "Full Time", position: 3, company: co["Swiggy"] },
  { title: "Senior Android Engineer", description: "Lead Android development at Uber India. Own ride booking, real-time driver tracking, and in-app payments. Mentor junior engineers and define architecture.", requirements: ["Kotlin", "Android Architecture", "RxJava", "Coroutines", "CI/CD"], salary: 34, experienceLevel: 5, location: "Hyderabad, India", jobType: "Full Time", position: 2, company: co["Uber"] },
  { title: "Flutter Developer", description: "Build Paytm's cross-platform mobile banking app with Flutter. Deliver high-performance UI for Android and iOS for India's largest digital payments platform.", requirements: ["Flutter", "Dart", "State Management", "REST APIs", "Firebase"], salary: 18, experienceLevel: 2, location: "Noida, India", jobType: "Full Time", position: 4, company: co["Paytm"] },
];

await Job.insertMany(jobs.map((j) => ({ ...j, created_by: recruiter._id, applications: [] })));

console.log("✅ Database seeded successfully!");
console.log(`📋 Created: ${companies.length} companies, ${jobs.length} jobs`);
console.log("👤 Demo recruiter: recruiter@seed.com / password123");
await mongoose.disconnect();
process.exit(0);