import os
from datetime import datetime, timedelta
from typing import Optional, Any

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv, find_dotenv
from motor.motor_asyncio import AsyncIOMotorDatabase

from .database import get_db
from .schemas import UserCreate, UserLogin, UserOut
from .models import UserModel

# ─── Load environment variables ────────────────────────────────────────────────
dotenv_path = find_dotenv()
print(">>> .env loaded from:", dotenv_path)
load_dotenv(dotenv_path)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

print(">>> SECRET_KEY is:", repr(SECRET_KEY))
# ────────────────────────────────────────────────────────────────────────────────

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_user_by_username(db, username):
    user_doc = await db["users"].find_one({"username": username})
    if user_doc:
        user_doc["_id"] = str(user_doc["_id"])
    return UserModel(**user_doc) if user_doc else None

async def create_user(
    db: AsyncIOMotorDatabase, user: UserCreate
) -> UserOut:
    """
    Create a new user with plain password (NOT recommended for production).
    """
    user_dict = {"username": user.username, "password": user.password}
    result = await db["users"].insert_one(user_dict)
    new_user = await db["users"].find_one({"_id": result.inserted_id})
    return UserOut(**{"_id": str(new_user["_id"]), "username": new_user["username"]})

def create_access_token(
    data: dict, expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token with an expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def authenticate_user(
    db: AsyncIOMotorDatabase, username: str, password: str
) -> Optional[UserModel]:
    """
    Verify username and password, returning the UserModel if valid.
    """
    user = await get_user_by_username(db, username)
    if not user or user.password != password:
        return None
    return user

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> UserOut:
    """
    Decode the JWT and return the current authenticated user.
    Raises HTTPException(401) if token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user_by_username(db, username)
    if not user:
        raise credentials_exception

    return UserOut(**{"_id": str(user.id), "username": user.username})


