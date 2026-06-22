from fastapi import APIRouter, Depends
from models import ChatRequest
from routes.auth import get_current_user
from services.ai_service import chat_with_bot

router = APIRouter()

@router.post("/")
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    # Simple stateless chat for MVP. Can be extended to fetch history from DB.
    response_text = await chat_with_bot(request.message, history=[])
    return {"reply": response_text}
