import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import Select from 'react-select';
import { LogOut, Map, ArrowRight, TrendingUp, DollarSign, Star, Flame, BarChart3, Briefcase, Target, Zap, AlertCircle, BrainCircuit, Edit3, CheckCircle2 } from 'lucide-react';
import { careerProfiles, inDemandCareers2026 } from '../data/careerProfiles';
import { calculateSkillGap, generatePersonalizedRoadmap } from '../utils/skillUtils';
import SkillMultiSelect from '../components/SkillMultiSelect';
import SkillGapBadges from '../components/SkillGapBadges';
import UpdateSkillsModal from '../components/UpdateSkillsModal';

const basicStrengthsOptions = ["Problem Solving", "Creativity", "Analytical Thinking", "Teamwork", "Leadership", "Communication", "Research", "Time Management", "Adaptability"].map(s => ({value: s, label: s}));
const basicWeaknessesOptions = ["Public Speaking", "DSA", "Confidence", "Resume Building", "Interview Skills", "Practical Projects", "English Communication"].map(s => ({value: s, label: s}));
const basicDomainsOptions = ["AI/ML", "Data Science", "Web Development", "Cybersecurity", "Cloud Computing", "UI/UX Design", "Business Analytics", "Product Management", "DevOps"].map(s => ({value: s, label: s}));

const customSelectStyles = {
  control: (base) => ({
    ...base,
    padding: '0.15rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    boxShadow: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '&:hover': { border: '1px solid #6366f1' }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#e0e7ff',
    borderRadius: '0.375rem'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#4338ca',
    fontWeight: '500'
  })
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Basic Profile State
  const [basicProfileCompleted, setBasicProfileCompleted] = useState(false);
  const [suggestedCareers, setSuggestedCareers] = useState([]);
  
  const [basicProfileForm, setBasicProfileForm] = useState({
    skills: [],
    strengths: [],
    weaknesses: [],
    domains: []
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProfileKey = () => {
    if (!user) return null;
    return `careerai_profile_${user.id || user.email}`;
  };

  useEffect(() => {
    checkProfile();
  }, []);

  useEffect(() => {
    const profileKey = getProfileKey();
    if (profileKey) {
      const storedProfile = localStorage.getItem(profileKey);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setBasicProfileForm(parsed);
        setBasicProfileCompleted(true);
        analyzeProfile(parsed);
      } else {
        setBasicProfileForm({ skills: [], strengths: [], weaknesses: [], domains: [] });
        setBasicProfileCompleted(false);
        setSuggestedCareers([]);
      }
    }
  }, [user]);

  const checkProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      const userData = res.data;
      if (userData.recommendations && userData.recommendations.length > 0) {
        setHasCompletedAssessment(true);
        
        // Ensure recommendations have current/missing skills parsed correctly if basic profile exists
        const profileKey = `careerai_profile_${userData.id || userData.email}`;
        const storedProfile = localStorage.getItem(profileKey);
        const parsedProfile = storedProfile ? JSON.parse(storedProfile) : null;
        
        const enhancedRecs = userData.recommendations.map(rec => {
          if (parsedProfile && parsedProfile.skills) {
            const gap = calculateSkillGap(parsedProfile.skills, rec.required_skills);
            return { ...rec, current_skills: gap.matchingSkills, missing_skills: gap.missingSkills };
          }
          return rec;
        });

        setRecommendations(enhancedRecs);
      } else {
        setHasCompletedAssessment(false);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const analyzeProfile = (profile) => {
    const rawSkills = profile.skills.map(s => typeof s === 'string' ? s : s.value);
    const rawStrengths = profile.strengths.map(s => s.value);
    const rawDomains = profile.domains.map(s => s.value);

    const suggestions = careerProfiles.map(career => {
      const gap = calculateSkillGap(rawSkills, career.requiredSkills);
      const strengthMatch = career.relatedStrengths.filter(s => rawStrengths.includes(s));
      
      let score = (gap.matchingSkills.length * 2.5) + (strengthMatch.length * 1.5);
      if (career.domains.some(d => rawDomains.includes(d))) score += 4;
      
      const maxPossible = (career.requiredSkills.length * 2.5) + (career.relatedStrengths.length * 1.5) + 4;
      const matchPercentage = Math.min(Math.round((score / maxPossible) * 100) + 15, 98); 
      
      return {
        ...career,
        matchPercentage,
        current_skills: gap.matchingSkills,
        missing_skills: gap.missingSkills
      };
    }).sort((a,b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
    
    setSuggestedCareers(suggestions);
  };

  const handleBasicProfileSubmit = (e) => {
    e.preventDefault();
    if (basicProfileForm.skills.length === 0 || basicProfileForm.domains.length === 0) {
      alert("Please select at least some skills and domains to proceed.");
      return;
    }
    
    const normalizedForm = {
      ...basicProfileForm,
      skills: Array.isArray(basicProfileForm.skills) 
        ? basicProfileForm.skills.map(s => typeof s === 'string' ? s : s.value)
        : []
    };

    const profileKey = getProfileKey();
    if (profileKey) {
      localStorage.setItem(profileKey, JSON.stringify(normalizedForm));
    }
    
    setBasicProfileForm(normalizedForm);
    setBasicProfileCompleted(true);
    analyzeProfile(normalizedForm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSkills = (newSkills) => {
    const updatedProfile = { ...basicProfileForm, skills: newSkills };
    setBasicProfileForm(updatedProfile);
    
    const profileKey = getProfileKey();
    if (profileKey) {
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    }
    
    // Recalculate everything
    analyzeProfile(updatedProfile);
    
    // If roadmap is open, update it
    if (roadmapData && roadmapData.requiredSkills) {
      const regenerated = generatePersonalizedRoadmap(updatedProfile, roadmapData);
      setRoadmapData({ ...roadmapData, ...regenerated });
    } else if (roadmapData && roadmapData.required_skills) {
      // For AI matches, it uses required_skills
      const gap = calculateSkillGap(newSkills, roadmapData.required_skills);
      setRoadmapData({ ...roadmapData, current_skills: gap.matchingSkills, missing_skills: gap.missingSkills });
    }

    // If assessment is completed, refresh recommendations state
    if (hasCompletedAssessment) {
      const updatedRecs = recommendations.map(rec => {
        const gap = calculateSkillGap(newSkills, rec.required_skills);
        return { ...rec, current_skills: gap.matchingSkills, missing_skills: gap.missingSkills };
      });
      setRecommendations(updatedRecs);
    }
  };

  const handleSelectCareer = (careerObj) => {
    setSelectedCareer(careerObj.title);
    
    if (basicProfileCompleted && careerObj.requiredSkills) {
      const regenerated = generatePersonalizedRoadmap(basicProfileForm, careerObj);
      setRoadmapData({ ...careerObj, ...regenerated });
    } else {
      setRoadmapData(careerObj);
    }
  };

  const fetchAIRoadmap = async (careerObj) => {
    setSelectedCareer(careerObj.title);
    setLoadingRoadmap(true);
    try {
      const res = await api.get(`/assessment/roadmap?target_career=${encodeURIComponent(careerObj.title)}`);
      
      let finalData = res.data;
      if (basicProfileCompleted) {
         // Apply skill gap calculation to AI response if user has set skills
         const gap = calculateSkillGap(basicProfileForm.skills, careerObj.required_skills);
         finalData = { ...finalData, current_skills: gap.matchingSkills, missing_skills: gap.missingSkills };
      }
      setRoadmapData(finalData);
    } catch (err) {
      console.error(err);
      alert('Failed to load roadmap.');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  if (loadingAuth) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Modal */}
      <UpdateSkillsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentSkills={basicProfileForm.skills}
        onSave={handleUpdateSkills}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-slate-800">Hello, {user?.name} 👋</h1>
          <p className="text-slate-500 mt-1">Welcome to your AI Career Dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          {basicProfileCompleted && !hasCompletedAssessment && (
            <button 
              onClick={() => navigate('/assessment')}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:-translate-y-0.5 transition flex items-center"
            >
              <BrainCircuit size={18} className="mr-2"/> Take Full AI Assessment
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            title="Log out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Listings & Flow */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FLOW 1: Basic Profile Form */}
          {!basicProfileCompleted && !hasCompletedAssessment && (
            <div className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/50 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-2">
                  <Target className="text-indigo-500 mr-2" size={24}/> Basic Career Profile
                </h2>
                <p className="text-slate-500 text-sm">Tell us a little bit about yourself to get instant, skill-based career directions before taking the deep AI assessment.</p>
              </div>

              <form onSubmit={handleBasicProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Known Skills</label>
                  <SkillMultiSelect 
                    value={basicProfileForm.skills} 
                    onChange={(val) => setBasicProfileForm({...basicProfileForm, skills: val})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Strengths</label>
                  <Select 
                    isMulti options={basicStrengthsOptions} styles={customSelectStyles} placeholder="Select strengths..."
                    value={basicProfileForm.strengths} onChange={(val) => setBasicProfileForm({...basicProfileForm, strengths: val})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Areas to Improve (Weaknesses)</label>
                  <Select 
                    isMulti options={basicWeaknessesOptions} styles={customSelectStyles} placeholder="Select weaknesses..."
                    value={basicProfileForm.weaknesses} onChange={(val) => setBasicProfileForm({...basicProfileForm, weaknesses: val})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Interested Domains</label>
                  <Select 
                    isMulti options={basicDomainsOptions} styles={customSelectStyles} placeholder="Select domains..."
                    value={basicProfileForm.domains} onChange={(val) => setBasicProfileForm({...basicProfileForm, domains: val})}
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition flex items-center justify-center"
                >
                  <Zap size={18} className="mr-2"/> Analyze My Profile
                </button>
              </form>
            </div>
          )}

          {/* FLOW 2: Skill-Based Suggestions (Pre-Assessment) */}
          {basicProfileCompleted && !hasCompletedAssessment && (
            <>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <Star className="text-indigo-500 mr-2" size={24}/> Recommended Directions
                  </h2>
                  <button 
                    onClick={() => {
                      setBasicProfileCompleted(false);
                      setRoadmapData(null);
                      setSelectedCareer(null);
                    }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition border border-indigo-100 shadow-sm"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="space-y-4">
                  {suggestedCareers.map((career, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSelectCareer(career)}
                      className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedCareer === career.title ? 'bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-500 ring-opacity-50' : 'bg-white/60 border-white/50 hover:bg-white/80 shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-lg">{career.title}</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {career.matchPercentage}% Match
                        </span>
                      </div>
                      
                      {/* Match Reason */}
                      <p className="text-sm text-slate-600 mb-3">
                        Recommended because you have <strong>{career.current_skills.length} matching skills</strong> and share core strengths like {career.relatedStrengths.slice(0,2).join(' & ')}.
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {career.missing_skills.slice(0,3).map((ms, i) => (
                          <span key={i} className="text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded">Miss: {ms}</span>
                        ))}
                      </div>

                      <button className="text-sm text-indigo-600 font-bold flex items-center hover:text-indigo-800 transition">
                        View Roadmap <ArrowRight size={16} className="ml-1"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where You Should Improve Section */}
              <div className="p-6 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm mt-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <AlertCircle className="text-orange-500 mr-2" size={20}/> Where You Should Improve
                </h3>
                <div className="space-y-5">
                  {suggestedCareers.map((career, idx) => (
                    <div key={idx} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                      <p className="font-semibold text-slate-700 text-sm mb-2">{career.title}</p>
                      
                      <div className="flex flex-col space-y-2 text-xs">
                        <div className="flex items-start">
                          <span className="font-medium w-20 text-slate-500 shrink-0">Current:</span>
                          <span className="text-green-600 font-medium">{career.current_skills.join(', ') || 'None yet'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium w-20 text-slate-500 shrink-0">Missing:</span>
                          <span className="text-rose-500 font-medium">{career.missing_skills.join(', ')}</span>
                        </div>
                        <div className="flex items-start mt-1 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                          <span className="font-medium text-slate-500 mr-2">Tip:</span>
                          <span className="text-slate-600">Start by learning {career.missing_skills.slice(0,2).join(' and ')}, then build a simple project to gain confidence.</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Careers Fallback */}
              <div className="pt-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center mb-4">
                  <Flame className="text-orange-500 mr-2" size={18}/> Or Explore Trending Roadmaps
                </h2>
                <div className="space-y-3">
                  {careerProfiles.slice(0,4).map((career, idx) => (
                    <div 
                      key={idx} onClick={() => handleSelectCareer(career)}
                      className="p-4 bg-white/50 border border-white/50 hover:bg-white/80 rounded-xl cursor-pointer transition shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm">{career.title}</h4>
                        <span className="text-xs text-slate-500">{career.demand}</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-400"/>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FLOW 3: Post-Assessment AI Matches */}
          {hasCompletedAssessment && (
            <>
              <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4">
                <Star className="text-yellow-500 mr-2" size={24}/> Your Top AI Matches
              </h2>
              
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {recommendations.map((career, idx) => (
                  <div 
                    key={idx}
                    onClick={() => fetchAIRoadmap(career)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedCareer === career.title ? 'bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-500 ring-opacity-50' : 'bg-white/60 border-white/50 hover:bg-white/80 shadow-sm'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{career.title}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${idx === 0 ? 'bg-green-100 text-green-700' : idx === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                        {career.match_percentage}% Match
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{career.reason}</p>
                    <div className="flex items-center text-xs font-medium text-slate-500 mb-4 space-x-3">
                      <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md"><DollarSign size={14} className="mr-0.5"/> {career.salary_range}</span>
                      <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md"><TrendingUp size={14} className="mr-1"/> {career.future_demand}</span>
                    </div>
                    
                    {career.missing_skills && career.missing_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {career.missing_skills.slice(0,3).map((ms, i) => (
                          <span key={i} className="text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded">Miss: {ms}</span>
                        ))}
                      </div>
                    )}

                    <button className="text-sm text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition">
                      View Personalized Roadmap <ArrowRight size={16} className="ml-1"/>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* Right Column: Roadmap Panel */}
        <div className="lg:col-span-7">
          {loadingRoadmap ? (
            <div className="h-full flex flex-col items-center justify-center bg-white/50 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg min-h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-slate-600 font-medium">AI is generating your custom learning path...</p>
              <p className="text-slate-400 text-sm mt-2">Analyzing your skill gaps and finding the best resources.</p>
            </div>
          ) : roadmapData ? (
            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/50 shadow-xl h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200 relative z-10">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{roadmapData.title || selectedCareer}</h2>
                    <p className="text-slate-500 font-medium mt-1">
                      {hasCompletedAssessment ? "Your Personalized AI Roadmap" : "Skill-Based Career Roadmap"}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-xl font-medium shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
                >
                  <Edit3 size={16} className="mr-2" /> Update Skills
                </button>
              </div>

              <div className="relative z-10">
                {/* Description */}
                {roadmapData.description && (
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {roadmapData.description}
                  </p>
                )}

                {/* Reusable Skill Gap Badges */}
                <SkillGapBadges 
                  matchingSkills={roadmapData.current_skills} 
                  missingSkills={roadmapData.missing_skills} 
                  focusAreas={roadmapData.focusAreas}
                />

                <h3 className="text-xl font-bold text-slate-800 mb-6">Learning Roadmap</h3>

                {/* Timeline */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-400 before:to-purple-400">
                  {roadmapData.roadmap?.map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                        {i+1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white shadow-sm border border-slate-100 transition duration-300 hover:shadow-md hover:border-indigo-100 group-hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-800">{step.month}</h4>
                        </div>
                        <p className="text-slate-700 text-sm mb-3 font-semibold text-indigo-600">{step.focus}</p>
                        <ul className="space-y-2">
                          {step.tasks?.map((task, j) => (
                            <li key={j} className="text-slate-600 text-sm flex items-start">
                              <ArrowRight size={14} className="text-indigo-400 mr-2 mt-0.5 shrink-0"/> 
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {roadmapData.recommendations && roadmapData.recommendations.length > 0 && (
                  <div className="mt-12 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-inner">
                    <h4 className="font-bold text-indigo-900 mb-4 flex items-center">
                      <Star size={18} className="mr-2"/> Recommended Resources & Next Steps
                    </h4>
                    <ul className="space-y-3">
                      {roadmapData.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start bg-white/60 p-3 rounded-xl border border-indigo-50">
                          <CheckCircle2 size={16} className="text-indigo-500 mr-3 mt-0.5 shrink-0"/>
                          <span className="text-indigo-900 text-sm font-medium">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 border-dashed min-h-[500px]">
              <div className="p-6 bg-white/50 rounded-full mb-6 shadow-sm">
                <Map size={56} className="text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Select a Career Path</h3>
              <p className="text-slate-500 text-center max-w-sm">
                Complete your profile or select a career on the left to view its detailed roadmap.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
