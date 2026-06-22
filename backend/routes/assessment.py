from fastapi import APIRouter, Depends, HTTPException
from models import Assessment, RecommendationResponse
from routes.auth import get_current_user
from services.ai_service import generate_recommendations, generate_skill_gap_and_roadmap
from database import get_db

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def submit_assessment(assessment: Assessment, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Save the assessment
    assessment_dict = assessment.dict()
    assessment_dict["user_email"] = current_user["email"]
    await db.assessments.insert_one(assessment_dict)
    
    # Generate recommendations using Gemini
    recommendations_data = await generate_recommendations(assessment_dict)
    
    # Save recommendations to user profile
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"recommendations": recommendations_data.get("careers", [])}}
    )
    
    return recommendations_data

@router.get("/roadmap")
async def get_roadmap(target_career: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Get user's latest assessment
    assessment = await db.assessments.find_one(
        {"user_email": current_user["email"]},
        sort=[("_id", -1)]
    )
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    known_skills = assessment.get("known_skills", [])
    
    roadmap_data = await generate_skill_gap_and_roadmap(target_career, known_skills)
    if not roadmap_data:
        raise HTTPException(status_code=500, detail="Failed to generate roadmap")
        
    return roadmap_data
