# 🚀 JobPortal — Full Stack MERN Job Portal

<div align="center">

![JobPortal Banner](https://img.shields.io/badge/JobPortal-MERN%20Stack-6A38C2?style=for-the-badge&logo=react&logoColor=white)

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)

A **production-grade job portal** connecting job seekers with recruiters — featuring AI-powered skill matching, smart resume analysis, dark mode, and a full analytics dashboard.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Screenshots](#-screenshots) · [API Docs](#-api-endpoints)

</div>

---

## ✨ Features

### 👩‍💻 For Job Seekers
- 🔍 **Smart Job Search** — filter by location, salary, experience, and job type
- 🤖 **AI Match Score** — see your % skill match for every job before applying
- 📄 **Resume Analyser** — upload your resume and get instant detailed feedback
- 🔖 **Save Jobs** — bookmark jobs to apply later
- 👤 **Profile Management** — upload photo and resume via Cloudinary
- 🌙 **Dark Mode** — smooth theme toggle with localStorage persistence

### 🏢 For Recruiters
- 🏗️ **Company Management** — create and manage company profiles
- 📝 **Job Posting** — post jobs with full details, requirements, and salary
- 📊 **Admin Dashboard** — charts and analytics (applications, job types, company stats)
- 👥 **Applicant Tracking** — view and manage all applicants per job

### 🛠️ Technical Highlights
- JWT authentication with HTTP-only cookies (XSS-safe)
- Role-based access control (Student / Recruiter)
- Rule-based resume analysis engine — no paid AI API needed
- Skeleton loading UI for smooth UX
- Fully responsive design — mobile first
- 40 seeded jobs across 8 categories from 20 real companies

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT, bcryptjs, HTTP-only Cookies |
| **File Storage** | Cloudinary (photos + resumes) |
| **PDF Processing** | pdf-parse |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Notifications** | Sonner (toast) |

---

## 📁 Project Structure

```
jobportal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── company.controller.js
│   │   ├── application.controller.js
│   │   └── resume.controller.js   # Rule-based resume analysis engine
│   ├── middleware/
│   │   ├── isAuthenticated.js     # JWT verification middleware
│   │   └── multer.js              # File upload (memoryStorage)
│   ├── models/
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── company.model.js
│   │   └── application.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── job.routes.js
│   │   ├── company.routes.js
│   │   ├── application.routes.js
│   │   └── resume.routes.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── seed.js                    # Database seeder (40 jobs, 20 companies)
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── admin/             # Dashboard, Companies, Jobs, Applicants
        │   ├── auth/              # Login, Signup
        │   ├── job/               # JobCard, JobDescription
        │   ├── profile/           # Profile page
        │   └── shared/            # Navbar, Footer
        ├── context/
        │   └── ThemeContext.jsx   # Dark mode context
        ├── hooks/                 # Custom hooks (useGetAllJobs, etc.)
        ├── pages/
        │   ├── Home.jsx
        │   ├── Jobs.jsx
        │   ├── Companies.jsx
        │   ├── SavedJobs.jsx
        │   └── ResumeAnalyser.jsx
        ├── redux/
        │   ├── store.js
        │   └── slices/            # authSlice, jobSlice, companySlice, applicationSlice
        └── utils/
            └── constant.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/jobportal.git
cd jobportal
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

Seed the database (run once):

```bash
node seed.js
```

> This creates **20 companies** + **40 jobs** across 8 categories + 1 demo recruiter account.

Start the backend:

```bash
npm run dev
```

Backend runs on **http://localhost:8000**

---

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

### 4. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Recruiter | recruiter@seed.com | password123 |
| Student | Register a new account | — |

---

## 📡 API Endpoints

### Auth — `/api/v1/user`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, receive JWT cookie |
| GET | `/logout` | Private | Clear auth cookie |
| GET | `/profile` | Private | Get logged-in user |
| POST | `/profile/update` | Private | Update profile + upload photo/resume |

### Jobs — `/api/v1/job`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/get?keyword=react` | Public | Search/get all jobs |
| GET | `/get/:id` | Public | Get single job |
| POST | `/post` | Recruiter | Post a new job |
| GET | `/getadminjobs` | Recruiter | Get recruiter's own jobs |

### Companies — `/api/v1/company`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Recruiter | Create company |
| GET | `/get` | Recruiter | Get own companies |
| GET | `/get/:id` | Recruiter | Get single company |
| PUT | `/update/:id` | Recruiter | Update company |

### Applications — `/api/v1/application`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/apply/:jobId` | Student | Apply to a job |
| GET | `/get` | Student | Get applied jobs |
| GET | `/:jobId/applicants` | Recruiter | Get job applicants |
| POST | `/status/:id/update` | Recruiter | Update applicant status |

### Resume — `/api/v1/resume`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/analyse` | Private | Analyse uploaded PDF resume |

---

## 🤖 Resume Analyser — How It Works

The resume analyser uses a **custom rule-based engine** — no paid AI API required.

```
PDF Upload → pdf-parse (text extraction)
          → Skill Detection    (100+ skills, 8 categories, regex word boundaries)
          → Section Detection  (Summary, Experience, Education, Skills, Projects)
          → Action Verb Check  (25 power verbs)
          → Quantification     (numbers + units regex)
          → Contact Detection  (email, phone, LinkedIn, GitHub)
          → Scoring Algorithm  (Overall 0-100, ATS 0-100)
          → Role Suggestion    (10 role-to-skill mappings)
          → Gap Analysis       (missing keywords + improvements with priority)
          → Structured Report
```

Returns: overall score, ATS score, extracted skills, strengths, improvements (with High/Medium/Low priority), section feedback, suggested roles, and missing keywords.

---

## 🌙 Dark Mode

Implemented using **Tailwind CSS `darkMode: 'class'`** strategy with React Context API.

- Theme stored in `localStorage` — persists across sessions
- `useEffect` toggles `dark` class on `<html>` root element
- Smooth CSS transitions (`0.3s ease`) prevent jarring flashes
- Toggle button in Navbar (Sun ☀️ / Moon 🌙)

---

## 📊 Admin Dashboard

Recruiters get a full analytics view with:
- **Bar chart** — Applications per job (top 6)
- **Pie chart** — Jobs by type distribution
- **Bar chart** — Jobs by company
- **Stats cards** — Total jobs, companies, applications, avg applications/job
- **Recent jobs table** — with click-through to applicants

Built with [Recharts](https://recharts.org).

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) — connect GitHub, auto-deploys |
| Backend | [Render](https://render.com) — free tier, set env vars |
| Database | MongoDB Atlas — already cloud-hosted |
| Storage | Cloudinary — already cloud-hosted |

> After deploying, update `FRONTEND_URL` in backend `.env` to your Vercel URL.

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT stored in **HTTP-only cookies** (XSS-safe, not accessible via JS)
- CORS configured to only allow frontend origin
- Protected routes on both frontend (route guards) and backend (middleware)
- Environment variables never committed (`.gitignore`)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ using the MERN Stack
</div>
