import React from 'react';
import Select from 'react-select';
import { MASTER_SKILLS_LIST } from '../utils/skillUtils';

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

const skillOptions = MASTER_SKILLS_LIST.map(skill => ({ value: skill, label: skill }));

export default function SkillMultiSelect({ value, onChange, placeholder = "Search skills..." }) {
  // Convert standard array of strings to react-select objects if needed
  const selectedOptions = Array.isArray(value) 
    ? value.map(v => (typeof v === 'string' ? { value: v, label: v } : v))
    : [];

  const handleChange = (selected) => {
    // Pass back array of string values or array of objects depending on usage, 
    // but standardizing to strings makes it easier for our calculateSkillGap logic
    onChange(selected ? selected.map(s => s.value) : []);
  };

  return (
    <Select
      isMulti
      options={skillOptions}
      styles={customSelectStyles}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      classNamePrefix="react-select"
    />
  );
}
