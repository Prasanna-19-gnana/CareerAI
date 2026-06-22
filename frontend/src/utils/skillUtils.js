export const MASTER_SKILLS_LIST = [
  "Python", "Java", "C", "C++", "JavaScript", "TypeScript", "React", "Node.js", 
  "Express.js", "HTML", "CSS", "Tailwind CSS", "SQL", "MongoDB", "PostgreSQL", 
  "Excel", "Power BI", "Tableau", "Pandas", "NumPy", "Matplotlib", "Machine Learning", 
  "Deep Learning", "NLP", "Generative AI", "TensorFlow", "PyTorch", 
  "Data Structures and Algorithms", "Git", "GitHub", "Docker", "Kubernetes", 
  "AWS", "Azure", "Google Cloud", "Linux", "Cybersecurity Basics", "Networking", 
  "UI/UX Design", "Figma", "Communication", "Leadership", "Teamwork", 
  "Problem Solving", "Analytical Thinking"
];

export function calculateSkillGap(userSkills, requiredSkills) {
  if (!requiredSkills) {
    return { matchingSkills: [], missingSkills: [], matchPercentage: 0 };
  }

  const matchingSkills = requiredSkills.filter(skill =>
    userSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(skill =>
    !userSkills.includes(skill)
  );

  const matchPercentage = Math.round(
    (matchingSkills.length / requiredSkills.length) * 100
  ) || 0;

  return {
    matchingSkills,
    missingSkills,
    matchPercentage
  };
}

export function generatePersonalizedRoadmap(userProfile, careerProfile) {
  const userSkills = userProfile.skills || []; // using skills instead of knownSkills based on existing basicProfileData structure
  const requiredSkills = careerProfile.requiredSkills || [];

  const matchingSkills = requiredSkills.filter(skill =>
    userSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(skill =>
    !userSkills.includes(skill)
  );

  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchingSkills.length / requiredSkills.length) * 100) 
    : 0;

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
