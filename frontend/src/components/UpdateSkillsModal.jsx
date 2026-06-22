import React, { useState } from 'react';
import SkillMultiSelect from './SkillMultiSelect';
import { X, Save } from 'lucide-react';

export default function UpdateSkillsModal({ isOpen, onClose, currentSkills, onSave }) {
  const [selectedSkills, setSelectedSkills] = useState(currentSkills || []);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedSkills);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-slate-200/60">
          <h3 className="text-xl font-bold text-slate-800">Update Your Skills</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Add or remove skills to instantly recalculate your career matches and roadmap skill gaps.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Skills</label>
            <SkillMultiSelect 
              value={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="Search or select skills..."
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            <Save size={18} className="mr-2" /> Save Skills
          </button>
        </div>
      </div>
    </div>
  );
}
