import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not set in the environment variables.")

client = AsyncIOMotorClient(MONGODB_URL)
# You can append the database name to the URL, but let's define it here
db = client.careerAI

def get_db():
    return db
