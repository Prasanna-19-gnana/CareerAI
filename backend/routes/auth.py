from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database import get_db
from models import UserCreate, UserLogin, Token
from utils.auth import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_db()
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }
    await db.users.insert_one(new_user)
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"name": user["name"], "email": user["email"]}}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    from utils.auth import decode_access_token
    email = decode_access_token(token)
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    db = get_db()
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
