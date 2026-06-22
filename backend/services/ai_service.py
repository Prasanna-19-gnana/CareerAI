import os
import json
import google.generativeai as genai

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    
model = genai.GenerativeModel('gemini-2.5-flash')

async def generate_recommendations(profile: dict):
    prompt = f"""
You are an expert career counselor AI. Based on the following student profile, recommend the top 3 suitable career paths.
For each career, provide:
- title: The job title (e.g., Data Scientist)
- match_percentage: An integer representing how well they match (e.g., 85)
- reason: A short explanation of why this career fits their profile
- required_skills: A list of key skills needed for this career
- salary_range: Expected salary range
- future_demand: A short sentence on future demand
- beginner_path: A 1-2 sentence beginner friendly path

Student Profile:
Academic Background: {profile.get('academic_background')}
Known Skills: {', '.join(profile.get('known_skills', []))}
Interests: {', '.join(profile.get('interests', []))}
Work Preference: {profile.get('work_preference')}
Preferred Domain: {profile.get('preferred_domain')}
Career Goals: {profile.get('career_goals')}
Strengths: {profile.get('strengths')}
Weaknesses: {profile.get('weaknesses')}

Return ONLY a valid JSON array of objects, with no markdown formatting or extra text. Example:
[
  {{
    "title": "Software Developer",
    "match_percentage": 90,
    "reason": "You like coding...",
    "required_skills": ["Python", "React"],
    "salary_range": "$70k-$100k",
    "future_demand": "High",
    "beginner_path": "Start with web dev basics..."
  }}
]
"""
    try:
        response = model.generate_content(prompt)
        # Strip potential markdown backticks
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        data = json.loads(text)
        return {"careers": data}
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {"careers": []}

async def generate_skill_gap_and_roadmap(target_career: str, known_skills: list):
    prompt = f"""
You are an expert career counselor AI. 
The student wants to become a "{target_career}".
They already know: {', '.join(known_skills)}.

First, identify the missing skills they need to learn.
Then, generate a step-by-step month-by-month learning roadmap (up to 6 months) to help them achieve this goal.

Return ONLY a valid JSON object matching this structure:
{{
  "current_skills": ["skill1", "skill2"],
  "missing_skills": ["skill3", "skill4"],
  "roadmap": [
    {{
      "month": "Month 1",
      "focus": "Brief focus description",
      "tasks": ["task 1", "task 2"]
    }}
  ],
  "recommendations": ["cert 1", "project 1"]
}}
"""
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return None

async def chat_with_bot(message: str, history: list = []):
    chat = model.start_chat(history=history)
    response = chat.send_message(message)
    return response.text
