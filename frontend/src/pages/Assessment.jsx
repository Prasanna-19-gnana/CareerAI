import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { BrainCircuit, BookOpen, Code, Briefcase, Heart, Target } from 'lucide-react';
import Select from 'react-select';

const academicBackgroundOptions = [
  "B.Tech / B.E. Computer Science", "B.Tech Information Technology", "B.Tech Data Science", 
  "B.Tech Artificial Intelligence", "B.Tech Electronics & Communication", "B.Tech Electrical Engineering", 
  "B.Tech Mechanical Engineering", "B.Tech Civil Engineering", "B.Sc Computer Science", "B.Sc Mathematics", 
  "B.Sc Statistics", "B.Sc Physics", "BCA", "MCA", "B.Com", "BBA", "MBA", "Arts & Humanities", 
  "Life Sciences / Biotechnology", "Other"
];

const preferredDomainOptions = [
  "Technology & Software", "Artificial Intelligence & Machine Learning", "Data Science & Analytics",
  "Cybersecurity", "Cloud Computing", "Web Development", "Mobile App Development", "UI/UX Design",
  "Game Development", "DevOps & SRE", "Blockchain", "Internet of Things (IoT)", "Robotics & Automation",
  "Digital Marketing", "Finance & FinTech", "Business Analysis", "Product Management", "Project Management",
  "Human Resources", "Sales & Marketing", "Healthcare Technology", "Education Technology", 
  "Research & Development", "Entrepreneurship & Startups", "Government & Public Sector"
];

const workPreferenceOptions = [
  "Remote", "Hybrid", "On-site", "Flexible Work Environment", "Startup Culture", 
  "Corporate Environment", "Research-Oriented", "Freelancing", "Entrepreneurship", "No Preference"
];

const careerGoalsOptions = [
  "Get an Entry-Level Job", "Become a Software Engineer", "Become a Data Scientist", 
  "Become an AI Engineer", "Become a Cybersecurity Expert", "Become a Product Manager", 
  "Become a Team Lead", "Work in Top MNCs", "Work Abroad", "Pursue Higher Studies", 
  "Start My Own Startup", "Research Career", "Government Job", "Freelance Career", 
  "Undecided / Exploring Options"
];

const strengthsOptions = [
  "Problem Solving", "Analytical Thinking", "Logical Reasoning", "Creativity", "Leadership", 
  "Communication Skills", "Public Speaking", "Teamwork", "Adaptability", "Critical Thinking", 
  "Time Management", "Attention to Detail", "Decision Making", "Research Skills", "Programming Skills", 
  "Mathematical Ability", "Learning New Technologies Quickly", "Project Management", "Innovation", 
  "Empathy", "Networking", "Strategic Thinking", "Persistence", "Self-Motivation", "Curiosity"
];

const weaknessesOptions = [
  "Public Speaking", "Time Management", "Overthinking", "Procrastination", "Lack of Confidence", 
  "Difficulty Delegating Work", "Perfectionism", "Impatience", "Fear of Failure", "Stress Management", 
  "Technical Knowledge Gaps", "Communication Issues", "Difficulty with Teamwork", "Difficulty Adapting to Change", 
  "Lack of Leadership Experience", "Weak Networking Skills", "Poor Organization", "Decision-Making Hesitation", 
  "Low Risk-Taking Ability", "Difficulty Handling Criticism", "Limited Industry Exposure", 
  "Limited Practical Experience", "Lack of Focus", "Difficulty Prioritizing Tasks", "Presentation Skills"
];

const strengthSelectOptions = strengthsOptions.map(opt => ({ value: opt, label: opt }));
const weaknessSelectOptions = weaknessesOptions.map(opt => ({ value: opt, label: opt }));

const customSelectStyles = {
  control: (base) => ({
    ...base,
    padding: '0.25rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    '&:hover': { border: '1px solid #14b8a6' }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#ccfbf1',
    borderRadius: '0.375rem'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#0f766e'
  })
};

export default function Assessment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState([]);
  const [formData, setFormData] = useState({
    academic_background: academicBackgroundOptions[0],
    known_skills: '',
    interests: '',
    work_preference: workPreferenceOptions[0],
    preferred_domain: preferredDomainOptions[0],
    career_goals: careerGoalsOptions[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Process skills and interests into arrays
    const payload = {
      ...formData,
      known_skills: formData.known_skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      strengths: selectedStrengths.map(s => s.value).join(', '),
      weaknesses: selectedWeaknesses.map(s => s.value).join(', ')
    };

    try {
      await api.post('/assessment/', payload);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass p-8 rounded-3xl shadow-xl relative overflow-hidden group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-white/50">
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-teal-100 text-teal-600 rounded-2xl shadow-inner">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Career Assessment</h2>
              <p className="text-slate-500 mt-1">Let AI discover your perfect career path</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <BookOpen size={16} className="mr-2 text-teal-500"/> Academic Background
                </label>
                <select 
                  name="academic_background" 
                  value={formData.academic_background} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/50"
                >
                  {academicBackgroundOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Target size={16} className="mr-2 text-teal-500"/> Preferred Domain
                </label>
                <select 
                  name="preferred_domain" 
                  value={formData.preferred_domain} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/50"
                >
                  {preferredDomainOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Code size={16} className="mr-2 text-teal-500"/> Known Skills (comma separated)
              </label>
              <textarea 
                name="known_skills" required rows="2"
                value={formData.known_skills} onChange={handleChange}
                placeholder="Python, React, Basic SQL, Communication"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/50 resize-none"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Heart size={16} className="mr-2 text-teal-500"/> Interests & Hobbies (comma separated)
              </label>
              <textarea 
                name="interests" required rows="2"
                value={formData.interests} onChange={handleChange}
                placeholder="Designing interfaces, analyzing data, mentoring"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Briefcase size={16} className="mr-2 text-teal-500"/> Work Preference
                </label>
                <select 
                  name="work_preference" 
                  value={formData.work_preference} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/50"
                >
                  {workPreferenceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  Career Goals
                </label>
                <select 
                  name="career_goals" 
                  value={formData.career_goals} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white/50"
                >
                  {careerGoalsOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Strengths</label>
                <Select 
                  isMulti
                  options={strengthSelectOptions}
                  styles={customSelectStyles}
                  value={selectedStrengths}
                  onChange={setSelectedStrengths}
                  placeholder="Select strengths..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Weaknesses</label>
                <Select 
                  isMulti
                  options={weaknessSelectOptions}
                  styles={customSelectStyles}
                  value={selectedWeaknesses}
                  onChange={setSelectedWeaknesses}
                  placeholder="Select weaknesses..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Profile...
                  </span>
                ) : 'Generate AI Career Recommendations'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
