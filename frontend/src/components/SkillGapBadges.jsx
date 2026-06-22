import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function SkillGapBadges({ matchingSkills = [], missingSkills = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      {matchingSkills && matchingSkills.length > 0 && (
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-green-100 shadow-sm">
          <h4 className="font-bold text-green-800 mb-3 flex items-center">
            <CheckCircle2 size={18} className="mr-2"/> Matching Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchingSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white text-green-700 border border-green-200 rounded-lg text-sm font-medium shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className={`p-5 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-100 shadow-sm ${(!matchingSkills || matchingSkills.length === 0) ? 'sm:col-span-2' : ''}`}>
        <h4 className="font-bold text-rose-800 mb-3 flex items-center">
          <Circle size={18} className="mr-2 text-rose-500"/> Skills to Improve
        </h4>
        <div className="flex flex-wrap gap-2">
          {missingSkills && missingSkills.length > 0 ? (
            missingSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white text-rose-700 border border-rose-200 rounded-lg text-sm font-medium shadow-sm">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-rose-500 font-medium italic">You have all required skills!</span>
          )}
        </div>
      </div>
    </div>
  );
}
