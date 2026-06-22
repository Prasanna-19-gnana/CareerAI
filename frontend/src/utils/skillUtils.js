import stringSimilarity from 'string-similarity';

export const MASTER_SKILLS_LIST = [
  "Python", "Java", "C", "C++", "JavaScript", "TypeScript", "React", "Node.js", 
  "Express.js", "HTML", "CSS", "Tailwind CSS", "SQL", "MongoDB", "PostgreSQL", 
  "Excel", "Power BI", "Tableau", "Pandas", "NumPy", "Matplotlib", "Machine Learning", 
  "Deep Learning", "NLP", "Generative AI", "TensorFlow", "PyTorch", 
  "Data Structures and Algorithms", "Git", "GitHub", "Docker", "Kubernetes", 
  "AWS", "Azure", "Google Cloud", "Linux", "Cybersecurity Basics", "Networking", 
  "UI/UX Design", "Figma", "Communication", "Leadership", "Teamwork", 
  "Problem Solving", "Analytical Thinking", "Artificial Intelligence"
];

export const SKILL_ALIASES = {
  "Artificial Intelligence": ["AI", "Artificial Intelligence Basics", "AI Fundamentals"],
  "Generative AI": ["Gen AI", "GenAI", "Generative Artificial Intelligence", "LLM Basics"],
  "Machine Learning": ["ML", "Machine Learning Basics"],
  "Deep Learning": ["DL", "Neural Networks"],
  "NumPy": ["Numpy", "Python Libraries", "Python Scientific Libraries"],
  "Pandas": ["Data Manipulation", "Python Data Analysis"],
  "SQL": ["MySQL", "PostgreSQL Queries", "Database Querying"],
  "JavaScript": ["JS", "ES6"],
  "React": ["ReactJS", "React.js"],
  "Node.js": ["Node", "NodeJS"],
  "Communication": ["Communication Skills", "Verbal Communication"]
};

export const SKILL_CATEGORIES = {
  "Python": "Programming", "Java": "Programming", "C": "Programming", "C++": "Programming",
  "JavaScript": "Web Development", "TypeScript": "Web Development", "React": "Web Development",
  "Node.js": "Web Development", "Express.js": "Web Development", "HTML": "Web Development",
  "CSS": "Web Development", "Tailwind CSS": "Web Development",
  "SQL": "Data Science", "MongoDB": "Data Science", "PostgreSQL": "Data Science",
  "Excel": "Data Science", "Power BI": "Data Science", "Tableau": "Data Science",
  "Pandas": "Data Science", "NumPy": "Data Science", "Matplotlib": "Data Science",
  "Machine Learning": "AI & ML", "Deep Learning": "AI & ML", "NLP": "AI & ML",
  "Generative AI": "AI & ML", "TensorFlow": "AI & ML", "PyTorch": "AI & ML",
  "Artificial Intelligence": "AI & ML",
  "Data Structures and Algorithms": "Programming", "Git": "Programming", "GitHub": "Programming",
  "Docker": "Cloud", "Kubernetes": "Cloud", "AWS": "Cloud", "Azure": "Cloud", "Google Cloud": "Cloud",
  "Linux": "Programming", "Cybersecurity Basics": "Cybersecurity", "Networking": "Cybersecurity",
  "UI/UX Design": "Design", "Figma": "Design",
  "Communication": "Soft Skills", "Leadership": "Soft Skills", "Teamwork": "Soft Skills",
  "Problem Solving": "Soft Skills", "Analytical Thinking": "Soft Skills"
};

export function normalizeSkill(skill) {
  if (!skill) return "";
  const cleaned = skill.trim().toLowerCase();

  // 1. Exact alias matching
  for (const [masterSkill, aliases] of Object.entries(SKILL_ALIASES)) {
    if (masterSkill.toLowerCase() === cleaned || aliases.some(alias => alias.toLowerCase() === cleaned)) {
      return masterSkill;
    }
  }

  // 2. Fallback to master list exact match (case insensitive)
  const exactMaster = MASTER_SKILLS_LIST.find(s => s.toLowerCase() === cleaned);
  if (exactMaster) return exactMaster;

  // 3. Fuzzy matching with string-similarity
  const matches = stringSimilarity.findBestMatch(cleaned, MASTER_SKILLS_LIST.map(s => s.toLowerCase()));
  if (matches.bestMatch.rating >= 0.8) {
    const masterIndex = matches.bestMatchIndex;
    return MASTER_SKILLS_LIST[masterIndex];
  }

  // 4. Return original if no match
  return skill.trim();
}

export function calculateSkillGap(userSkills, requiredSkills) {
  if (!requiredSkills) {
    return { matchingSkills: [], missingSkills: [], matchPercentage: 0 };
  }

  // Normalize inputs
  const normalizedUser = [...new Set(userSkills.map(normalizeSkill))];
  const normalizedRequired = [...new Set(requiredSkills.map(normalizeSkill))];

  const matchingSkills = normalizedRequired.filter(skill =>
    normalizedUser.includes(skill)
  );

  const missingSkills = normalizedRequired.filter(skill =>
    !normalizedUser.includes(skill)
  );

  const matchPercentage = normalizedRequired.length > 0 
    ? Math.round((matchingSkills.length / normalizedRequired.length) * 100) 
    : 0;

  return {
    matchingSkills,
    missingSkills,
    matchPercentage
  };
}

export function generatePersonalizedRoadmap(userProfile, careerProfile) {
  const userSkills = userProfile.skills || []; 
  const requiredSkills = careerProfile.requiredSkills || [];

  const { matchingSkills, missingSkills, matchPercentage } = calculateSkillGap(userSkills, requiredSkills);

  const highPriority = missingSkills.slice(0, 3);
  const mediumPriority = missingSkills.slice(3, 6);
  const lowPriority = missingSkills.slice(6);

  return {
    title: careerProfile.title,
    description: careerProfile.description,
    demand: careerProfile.demand,
    matchPercentage,
    current_skills: matchingSkills,
    missing_skills: missingSkills,
    focusAreas: {
      highPriority,
      mediumPriority,
      lowPriority
    },
    roadmap: [
      {
        month: "Month 1",
        focus: highPriority.length > 0 ? `Strengthen basics: ${highPriority.join(", ")}` : "Strengthen basics and foundations"
      },
      {
        month: "Month 2",
        focus: mediumPriority.length > 0 ? `Learn core career skills: ${mediumPriority.join(", ")}` : "Deep dive into advanced topics"
      },
      {
        month: "Month 3",
        focus: "Build beginner-level projects"
      },
      {
        month: "Month 4",
        focus: lowPriority.length > 0 ? `Practice advanced skills: ${lowPriority.join(", ")}` : "Explore edge cases and optimization"
      },
      {
        month: "Month 5",
        focus: "Create portfolio, GitHub projects, and resume keywords"
      },
      {
        month: "Month 6",
        focus: "Apply for internships and prepare for interviews"
      }
    ]
  };
}
