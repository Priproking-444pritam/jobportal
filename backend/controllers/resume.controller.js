import pdfParse from "pdf-parse/lib/pdf-parse.js";

// ─── DATA BANKS ──────────────────────────────────────────────────────────────

const SKILLS_DB = {
  frontend: ["react","reactjs","react.js","vue","vuejs","angular","next.js","nextjs","typescript","javascript","js","html","css","sass","scss","tailwind","bootstrap","redux","zustand","webpack","vite","figma","jquery","svelte","gatsby","remix"],
  backend: ["node","nodejs","node.js","express","expressjs","django","flask","fastapi","spring","springboot","laravel","rails","ruby","php","graphql","rest","restful","api","microservices","kafka","rabbitmq","grpc"],
  database: ["mongodb","mysql","postgresql","postgres","sqlite","redis","firebase","dynamodb","cassandra","oracle","sql","nosql","mongoose","prisma","sequelize","typeorm"],
  devops: ["docker","kubernetes","aws","azure","gcp","ci/cd","jenkins","github actions","terraform","ansible","linux","nginx","apache","heroku","vercel","netlify","prometheus","grafana"],
  mobile: ["react native","flutter","swift","kotlin","android","ios","expo","xamarin","ionic"],
  languages: ["python","java","c++","c#","go","golang","rust","scala","kotlin","swift","php","ruby","r","matlab","bash","shell"],
  ai_ml: ["machine learning","deep learning","tensorflow","pytorch","keras","scikit-learn","pandas","numpy","nlp","computer vision","llm","openai","langchain","huggingface","data science","jupyter"],
  tools: ["git","github","gitlab","jira","confluence","figma","postman","swagger","linux","agile","scrum","kanban","vs code","intellij"],
};

const ALL_SKILLS = Object.values(SKILLS_DB).flat();

const ROLE_SKILL_MAP = [
  { role: "Frontend Developer", skills: ["react","vue","angular","javascript","typescript","html","css","tailwind","next.js"], min: 2 },
  { role: "Backend Developer", skills: ["node","express","django","flask","java","spring","python","mongodb","postgresql","mysql","api"], min: 2 },
  { role: "Full Stack Developer", skills: ["react","node","javascript","mongodb","express","html","css","api"], min: 3 },
  { role: "DevOps Engineer", skills: ["docker","kubernetes","aws","azure","ci/cd","linux","terraform","jenkins","github actions"], min: 2 },
  { role: "Data Scientist", skills: ["python","machine learning","tensorflow","pytorch","pandas","numpy","scikit-learn","sql","data science"], min: 2 },
  { role: "Mobile Developer", skills: ["react native","flutter","android","ios","swift","kotlin","expo"], min: 1 },
  { role: "Cloud Engineer", skills: ["aws","azure","gcp","docker","kubernetes","terraform","linux"], min: 2 },
  { role: "ML Engineer", skills: ["python","tensorflow","pytorch","machine learning","deep learning","keras","mlops"], min: 2 },
  { role: "UI/UX Designer", skills: ["figma","adobe xd","sketch","prototyping","user research","wireframing","css"], min: 1 },
  { role: "Software Engineer", skills: ["python","java","javascript","c++","go","git","algorithms","data structures"], min: 2 },
];

const ACTION_VERBS = ["developed","built","designed","implemented","created","led","managed","optimized","improved","reduced","increased","deployed","architected","engineered","launched","delivered","automated","integrated","collaborated","mentored","spearheaded","drove","achieved","established","maintained"];

const SECTIONS = {
  summary: ["summary","objective","about","profile","overview","introduction"],
  experience: ["experience","work experience","employment","career","work history","professional experience","internship"],
  education: ["education","academic","qualification","degree","university","college","school"],
  skills: ["skills","technical skills","core competencies","technologies","tech stack","competencies","expertise"],
  projects: ["projects","personal projects","academic projects","portfolio","side projects","work samples"],
  certifications: ["certification","certifications","certificate","courses","training","achievements","awards"],
  contact: ["email","phone","linkedin","github","portfolio","contact"],
};

const HIGH_VALUE_KEYWORDS = ["github","linkedin","portfolio","quantified","metrics","led","managed","team","production","deployed","scalable","performance","optimized","million","thousand","percent","%","users","revenue","reduced","improved","increased"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function extractText(text) {
  return text.toLowerCase().replace(/[^\w\s.@+#/]/g, " ").replace(/\s+/g, " ").trim();
}

function detectSkills(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const skill of ALL_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) found.add(skill);
  }
  return [...found];
}

function detectSections(text) {
  const lower = text.toLowerCase();
  const found = {};
  for (const [key, keywords] of Object.entries(SECTIONS)) {
    found[key] = keywords.some(kw => lower.includes(kw));
  }
  return found;
}

function countActionVerbs(text) {
  const lower = text.toLowerCase();
  return ACTION_VERBS.filter(v => lower.includes(v));
}

function hasQuantifiedAchievements(text) {
  return /\d+\s*(%|percent|users|million|thousand|k\b|x\b|times|hours|days|weeks|months)/.test(text.toLowerCase());
}

function hasContactInfo(text) {
  const lower = text.toLowerCase();
  const hasEmail = /@/.test(text);
  const hasPhone = /\b\d{10}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/.test(text);
  const hasLinkedIn = lower.includes("linkedin");
  const hasGithub = lower.includes("github");
  return { hasEmail, hasPhone, hasLinkedIn, hasGithub };
}

function estimateWordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function detectRoles(skills) {
  const skillsLower = skills.map(s => s.toLowerCase());
  const matched = [];
  for (const { role, skills: required, min } of ROLE_SKILL_MAP) {
    const matches = required.filter(r => skillsLower.some(s => s.includes(r) || r.includes(s)));
    if (matches.length >= min) matched.push({ role, score: matches.length });
  }
  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, 5).map(m => m.role);
}

function getMissingKeywords(skills, sections) {
  const missing = [];
  const skillsLower = skills.map(s => s.toLowerCase());
  if (!skillsLower.some(s => ["git","github","gitlab"].includes(s))) missing.push("Git/GitHub");
  if (!sections.projects) missing.push("Projects Section");
  if (!sections.summary) missing.push("Professional Summary");
  if (!skillsLower.some(s => ["docker","kubernetes","aws","azure","ci/cd"].includes(s))) missing.push("Cloud/DevOps skills");
  if (!skillsLower.some(s => ["agile","scrum"].includes(s))) missing.push("Agile/Scrum");
  if (skills.length < 8) missing.push("More technical skills");
  if (!skillsLower.some(s => ["api","rest","restful"].includes(s))) missing.push("REST API");
  return missing.slice(0, 8);
}

// ─── SCORING ─────────────────────────────────────────────────────────────────

function calculateScores(text, skills, sections, actionVerbs, wordCount, contact) {
  let overall = 0;
  let ats = 0;

  // Skills (30 pts)
  const skillScore = Math.min(30, skills.length * 2.5);
  overall += skillScore;
  ats += Math.min(25, skills.length * 2);

  // Sections completeness (25 pts)
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const sectionScore = Math.min(25, sectionCount * 4);
  overall += sectionScore;
  ats += sections.skills ? 15 : 0;
  ats += sections.experience ? 10 : 0;

  // Action verbs (15 pts)
  const verbScore = Math.min(15, actionVerbs.length * 2);
  overall += verbScore;

  // Quantified achievements (10 pts)
  if (hasQuantifiedAchievements(text)) { overall += 10; ats += 10; }

  // Contact info (10 pts)
  if (contact.hasEmail) { overall += 3; ats += 5; }
  if (contact.hasPhone) overall += 2;
  if (contact.hasLinkedIn) { overall += 2; ats += 5; }
  if (contact.hasGithub) overall += 3;

  // Word count (10 pts)
  if (wordCount >= 300 && wordCount <= 800) overall += 10;
  else if (wordCount >= 200) overall += 6;
  else if (wordCount > 100) overall += 3;

  // Bonus
  if (sections.projects) { overall += 5; ats += 5; }
  if (sections.certifications) overall += 3;

  return {
    overall: Math.min(100, Math.round(overall)),
    ats: Math.min(100, Math.round(ats)),
  };
}

function getScoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Average";
  return "Needs Work";
}

// ─── ANALYSIS BUILDER ────────────────────────────────────────────────────────

function buildAnalysis(rawText) {
  const text = extractText(rawText);
  const skills = detectSkills(rawText);
  const sections = detectSections(rawText);
  const actionVerbs = countActionVerbs(rawText);
  const wordCount = estimateWordCount(rawText);
  const contact = hasContactInfo(rawText);
  const quantified = hasQuantifiedAchievements(rawText);
  const { overall, ats } = calculateScores(text, skills, sections, actionVerbs, wordCount, contact);
  const suggestedRoles = detectRoles(skills);
  const missingKeywords = getMissingKeywords(skills, sections);

  // ── Strengths ──
  const strengths = [];
  if (skills.length >= 10) strengths.push({ point: "Strong Technical Skill Set", detail: `Detected ${skills.length} technical skills including ${skills.slice(0,4).join(", ")} and more. This shows solid technical depth.` });
  else if (skills.length >= 5) strengths.push({ point: "Good Range of Skills", detail: `Detected ${skills.length} skills: ${skills.slice(0,4).join(", ")}. Consider adding more to strengthen your profile.` });
  if (actionVerbs.length >= 5) strengths.push({ point: "Strong Use of Action Verbs", detail: `Found impactful verbs like "${actionVerbs.slice(0,3).join('", "')}" — this makes your experience section compelling to recruiters.` });
  if (quantified) strengths.push({ point: "Quantified Achievements", detail: "Your resume includes numbers and metrics. Quantified results (%, users, revenue) are one of the top factors recruiters look for." });
  if (sections.projects) strengths.push({ point: "Projects Section Present", detail: "Having a dedicated projects section significantly boosts your profile, especially for freshers and early-career engineers." });
  if (sections.summary) strengths.push({ point: "Professional Summary Included", detail: "A summary helps recruiters quickly understand your profile and makes your resume more ATS-friendly." });
  if (contact.hasLinkedIn && contact.hasGithub) strengths.push({ point: "Strong Online Presence", detail: "Including both LinkedIn and GitHub shows professionalism and gives recruiters easy access to your work." });
  if (wordCount >= 300 && wordCount <= 700) strengths.push({ point: "Ideal Resume Length", detail: `At ~${wordCount} words, your resume is concise and well-scoped. The sweet spot for most technical roles is 300-700 words.` });
  if (sections.certifications) strengths.push({ point: "Certifications Listed", detail: "Certifications demonstrate continuous learning — highly valued in the current tech market." });

  // ── Improvements ──
  const improvements = [];
  if (skills.length < 8) improvements.push({ point: "Add More Technical Skills", detail: `Only ${skills.length} skills detected. Aim for 10-15 relevant skills. Add missing ones from job descriptions you're targeting.`, priority: "High" });
  if (!quantified) improvements.push({ point: "Add Numbers and Metrics", detail: "None of your achievements are quantified. Replace vague statements with specific numbers: 'Improved performance by 40%', 'Built app used by 5000+ users'.", priority: "High" });
  if (!sections.summary) improvements.push({ point: "Add a Professional Summary", detail: "A 2-3 line summary at the top dramatically improves ATS rankings and helps recruiters immediately understand your profile.", priority: "High" });
  if (!sections.projects) improvements.push({ point: "Add a Projects Section", detail: "No projects section detected. Projects are the #1 thing tech recruiters look at for freshers. Add 2-3 with tech stack and GitHub links.", priority: "High" });
  if (actionVerbs.length < 4) improvements.push({ point: "Use More Action Verbs", detail: "Start bullet points with strong verbs: Built, Developed, Implemented, Optimized, Led, Reduced, Increased. Avoid passive voice.", priority: "Medium" });
  if (!contact.hasLinkedIn) improvements.push({ point: "Add LinkedIn Profile", detail: "LinkedIn URL is missing. 90% of recruiters check LinkedIn before responding. Add it prominently at the top.", priority: "Medium" });
  if (!contact.hasGithub) improvements.push({ point: "Add GitHub Profile", detail: "GitHub link not found. For tech roles, a GitHub profile with active projects is almost mandatory. Add it to your header.", priority: "Medium" });
  if (wordCount < 250) improvements.push({ point: "Resume Too Short", detail: `Only ~${wordCount} words detected. A strong resume should be 400-700 words. Expand your experience descriptions and add more detail.`, priority: "High" });
  if (wordCount > 900) improvements.push({ point: "Resume Too Long", detail: `~${wordCount} words detected — this may be too long for a 1-page resume. Trim older or irrelevant experience. Aim for 400-700 words.`, priority: "Medium" });
  if (!sections.certifications) improvements.push({ point: "Consider Adding Certifications", detail: "AWS, Google Cloud, Meta React, MongoDB certifications are free/cheap and highly valued. Add any relevant ones.", priority: "Low" });

  // ── Section Feedback ──
  const sectionFeedback = {
    summary: sections.summary ? "Summary section found. Make sure it's 2-3 lines, tailored to the role, and includes your top skills and years of experience." : "No summary found. Add a 2-3 line professional summary at the top — it's the first thing recruiters read.",
    experience: sections.experience ? `Experience section found. ${actionVerbs.length >= 4 ? "Good use of action verbs." : "Try starting each bullet with a strong action verb."} ${quantified ? "Good quantification!" : "Add specific numbers/metrics to each achievement."}` : "No experience section detected. Even internship, freelance, or academic project experience counts.",
    education: sections.education ? "Education section found. Make sure to include your CGPA/percentage if above 7.5/75%." : "Education section not clearly detected. Ensure it's labeled 'Education' for ATS compatibility.",
    skills: sections.skills ? `Skills section found with ${skills.length} detected skills. ${skills.length < 8 ? "Consider expanding with more relevant technologies." : "Good skill coverage!"}` : "No dedicated skills section found. Add one — ATS systems heavily scan the skills section.",
    projects: sections.projects ? "Projects section found. Make sure each project has: title, tech stack, brief description, and GitHub/live link." : "No projects section found. This is critical for tech roles — add 2-3 projects with descriptions and links.",
  };

  // ── Summary text ──
  const summary = `Your resume scored ${overall}/100 with ${skills.length} technical skills detected across ${Object.values(sections).filter(Boolean).length} sections. ${overall >= 70 ? "Strong overall — focus on the improvements to make it recruiter-ready." : overall >= 50 ? "Decent foundation, but several key improvements will significantly boost your shortlisting rate." : "Needs significant work before applying. Focus on the High priority improvements first."}`;

  // ── ATS feedback ──
  const atsFeedback = `ATS score: ${ats}/100. ${ats >= 70 ? "Your resume is fairly ATS-friendly." : "Your resume may get filtered by ATS systems."} ${sections.skills && sections.experience ? "Good section structure detected." : "Ensure all sections are clearly labeled."} ${skills.length >= 8 ? "Good keyword density." : "Add more technical keywords from job descriptions."}`;

  return {
    overallScore: overall,
    scoreLabel: getScoreLabel(overall),
    summary,
    extractedSkills: skills.slice(0, 25),
    strengths: strengths.slice(0, 6),
    improvements: improvements.slice(0, 8),
    atsScore: ats,
    atsFeedback,
    suggestedRoles: suggestedRoles.length ? suggestedRoles : ["Software Engineer", "Full Stack Developer", "Backend Developer"],
    missingKeywords,
    sectionFeedback,
  };
}

// ─── CONTROLLER ──────────────────────────────────────────────────────────────

export const analyseResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText || resumeText.length < 100) {
      return res.status(400).json({ success: false, message: "Could not extract text. Make sure your PDF is not a scanned image." });
    }

    const analysis = buildAnalysis(resumeText);
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({ success: false, message: "Analysis failed. Please try again." });
  }
};