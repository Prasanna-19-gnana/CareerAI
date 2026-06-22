import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Map, ArrowRight, CheckCircle2, Circle, TrendingUp, DollarSign, Star } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // We would ideally fetch recommendations from DB if they exist.
    // For MVP, if they just submitted assessment, they might want to view it.
    // Let's create an endpoint or just prompt them to take assessment if none exist.
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      // In a full app, we'd add an endpoint `GET /auth/me` that returns user doc including `recommendations`.
      // Since we don't have that endpoint, let's just show a welcome and a button to take assessment.
      setLoadingAuth(false);
    } catch (error) {
      console.error(error);
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchRoadmap = async (careerTitle) => {
    setSelectedCareer(careerTitle);
    setLoadingRoadmap(true);
    try {
      const res = await api.get(`/assessment/roadmap?target_career=${encodeURIComponent(careerTitle)}`);
      setRoadmapData(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load roadmap. Did you complete the assessment?');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  if (loadingAuth) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hello, {user?.name} 👋</h1>
          <p className="text-slate-500 text-sm">Welcome to your AI Career Dashboard</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/assessment')}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition"
          >
            Take Assessment
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recommendations */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Star className="text-yellow-500 mr-2" size={20}/> Your Top Matches
          </h2>
          
          <div className="p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-md">
            <p className="text-slate-600 mb-4 text-sm">
              We recommend taking the AI career assessment to get personalized career matches.
            </p>
            <button 
              onClick={() => navigate('/assessment')}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:-translate-y-0.5 transition"
            >
              Start Assessment
            </button>
          </div>

          {/* Dummy Recommendations for visual purposes if no API data yet */}
          <div className="space-y-4">
            {['Data Scientist', 'AI/ML Engineer'].map((career, idx) => (
              <div 
                key={idx}
                onClick={() => fetchRoadmap(career)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedCareer === career ? 'bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-500 ring-opacity-50' : 'bg-white/60 border-white/50 hover:bg-white/80 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{career}</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                    {95 - idx * 5}% Match
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-3 space-x-3">
                  <span className="flex items-center"><DollarSign size={12} className="mr-1"/> $80k-$120k</span>
                  <span className="flex items-center"><TrendingUp size={12} className="mr-1"/> High Demand</span>
                </div>
                <button className="text-sm text-indigo-600 font-medium flex items-center">
                  View Roadmap <ArrowRight size={14} className="ml-1"/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Roadmap & Skill Gap */}
        <div className="lg:col-span-2">
          {loadingRoadmap ? (
            <div className="h-full flex items-center justify-center bg-white/50 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600">AI is generating your custom learning path...</p>
              </div>
            </div>
          ) : roadmapData ? (
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-200">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Map size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedCareer} Roadmap</h2>
                  <p className="text-slate-500">Your personalized step-by-step guide</p>
                </div>
              </div>

              {/* Skill Gap */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <CheckCircle2 size={16} className="mr-2"/> You Already Know
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.current_skills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                  <h4 className="font-bold text-orange-800 mb-3 flex items-center">
                    <Circle size={16} className="mr-2 text-orange-500"/> Skills to Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.missing_skills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-lg text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:to-purple-500">
                {roadmapData.roadmap?.map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                      {i+1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white shadow-md border border-slate-100 transition duration-300 hover:shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800 text-lg">{step.month}</h4>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 font-medium text-indigo-600">{step.focus}</p>
                      <ul className="space-y-1.5">
                        {step.tasks?.map((task, j) => (
                          <li key={j} className="text-slate-500 text-sm flex items-start">
                            <span className="text-indigo-400 mr-2">•</span> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {roadmapData.recommendations && (
                <div className="mt-10 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2">Extra Recommendations</h4>
                  <ul className="list-disc pl-5 text-indigo-800 text-sm space-y-1">
                    {roadmapData.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 border-dashed min-h-[400px]">
              <div className="text-center max-w-sm">
                <Map size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Career Path</h3>
                <p className="text-slate-500 text-sm">Click on any recommended career on the left to generate your personalized learning roadmap.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
