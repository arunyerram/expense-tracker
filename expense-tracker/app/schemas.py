

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


#
# ── EXPENSE SCHEMAS ─────────────────────────────────────────────────────────────
#
class ExpenseBase(BaseModel):
    title: str
    amount: float
    date: datetime = Field(default_factory=datetime.utcnow)
    description: Optional[str] = None
    category: Optional[str] = None

    model_config = {
        # allow populating by alias (so we can receive "_id" as "id")
        "populate_by_name": True
    }


class ExpenseCreate(ExpenseBase):
    """
    Payload for creating a new expense.
    """
    pass


class ExpenseUpdate(BaseModel):
    """
    Payload for updating an existing expense; all fields optional.
    """
    title: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    category: Optional[str] = None


class ExpenseOut(ExpenseBase):
    """
    What we return to clients when reading expenses.
    Includes both the expense ID and the owner’s ID.
    """
    id: str = Field(..., alias="_id")
    owner_id: str

    model_config = {
        "populate_by_name": True,
    }
    


#
# ── USER & AUTH SCHEMAS ──────────────────────────────────────────────────────────
#
class UserCreate(BaseModel):
    """
    Payload for registering a new user.
    """
    username: str
    password: str


class UserLogin(BaseModel):
    """
    Payload for logging in.
    """
    username: str
    password: str


class UserOut(BaseModel):
    """
    What we return to clients when reading user info.
    """
    id: str = Field(..., alias="_id")
    username: str

    model_config = {
        "populate_by_name": True,
    }


class Token(BaseModel):
    """
    The JWT access token response.
    """
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
