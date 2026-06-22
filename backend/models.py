from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    name: str
    email: EmailStr
    recommendations: Optional[List[dict]] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class Assessment(BaseModel):
    academic_background: str
    known_skills: List[str]
    interests: List[str]
    work_preference: str
    preferred_domain: str
    career_goals: str
    strengths: str
    weaknesses: str

class CareerRecommendation(BaseModel):
    title: str
    match_percentage: int
    reason: str
    required_skills: List[str]
    salary_range: str
    future_demand: str
    beginner_path: str

class RecommendationResponse(BaseModel):
    careers: List[CareerRecommendation]

class ChatRequest(BaseModel):
    message: str
