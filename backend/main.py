from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, assessment, chatbot

app = FastAPI(title="CareerAI MVP Backend")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only, configure properly in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(assessment.router, prefix="/assessment", tags=["assessment"])
app.include_router(chatbot.router, prefix="/chat", tags=["chatbot"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CareerAI Backend"}
