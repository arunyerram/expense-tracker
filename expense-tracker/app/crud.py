from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from .schemas import ExpenseCreate, ExpenseUpdate, ExpenseOut

COLLECTION = "expenses"

def _cast(doc: dict) -> dict:
    """
    Convert Mongo ObjectId fields to strings for Pydantic.
    """
    if not doc:
        return {}
    doc["_id"] = str(doc["_id"])
    doc["owner_id"] = str(doc.get("owner_id"))
    return doc

async def create_expense(
    db: AsyncIOMotorDatabase,
    expense: ExpenseCreate,
    owner_id: str
) -> ExpenseOut:
    """
    Create a new expense tied to the given owner_id.
    """
    doc = expense.dict()
    doc["owner_id"] = ObjectId(owner_id)
    result = await db[COLLECTION].insert_one(doc)
    new = await db[COLLECTION].find_one({"_id": result.inserted_id})
    return ExpenseOut(**_cast(new))

async def get_expense(
    db: AsyncIOMotorDatabase,
    id: str,
    owner_id: str
) -> Optional[ExpenseOut]:
    """
    Get a single expense by ID, only if it belongs to owner_id.
    """
    obj_id = ObjectId(id)
    doc = await db[COLLECTION].find_one({"_id": obj_id, "owner_id": ObjectId(owner_id)})
    if doc:
        return ExpenseOut(**_cast(doc))
    return None

async def get_expenses(
    db: AsyncIOMotorDatabase,
    owner_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[ExpenseOut]:
    """
    List expenses for the given owner_id.
    """
    cursor = db[COLLECTION].find({"owner_id": ObjectId(owner_id)}).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(ExpenseOut(**_cast(doc)))
    return results

async def update_expense(
    db: AsyncIOMotorDatabase,
    id: str,
    expense: ExpenseUpdate,
    owner_id: str
) -> Optional[ExpenseOut]:
    """
    Update fields of an existing expense, only if it belongs to owner_id.
    """
    obj_id = ObjectId(id)
    updates = {k: v for k, v in expense.dict().items() if v is not None}
    if updates:
        await db[COLLECTION].update_one(
            {"_id": obj_id, "owner_id": ObjectId(owner_id)},
            {"$set": updates}
        )
    doc = await db[COLLECTION].find_one({
        "_id": obj_id,
        "owner_id": ObjectId(owner_id)
    })
    return ExpenseOut(**_cast(doc)) if doc else None

async def delete_expense(
    db: AsyncIOMotorDatabase,
    id: str,
    owner_id: str
) -> bool:
    """
    Delete an expense by ID if it belongs to owner_id.
    """
    obj_id = ObjectId(id)
    res = await db[COLLECTION].delete_one({
        "_id": obj_id,
        "owner_id": ObjectId(owner_id)
    })
    return res.deleted_count == 1
