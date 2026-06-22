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
