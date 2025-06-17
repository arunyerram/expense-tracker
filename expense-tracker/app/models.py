from bson import ObjectId
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from pydantic_core import core_schema
from pydantic import GetCoreSchemaHandler

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source, _handler: GetCoreSchemaHandler):
        return core_schema.no_info_after_validator_function(
            cls.validate, core_schema.str_schema()
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")

class UserModel(BaseModel):
    id: str = Field(alias="_id")
    username: str
    password: str  # <--- store plain password
    created_at: Optional[datetime] = None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }

class ExpenseModel(BaseModel):
    id: str = Field(alias="_id")
    owner_id: str
    title: str
    amount: float
    date: datetime
    description: Optional[str] = None
    category: Optional[str] = None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
