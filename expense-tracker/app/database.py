import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv

# Load MONGODB_URL (and optional DB name) from your .env
load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME       = os.getenv("MONGODB_DB_NAME", None)

if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL must be set in your .env file")

# Initialize the Mongo client
client = AsyncIOMotorClient(MONGODB_URL)

# Choose the database:
#  - If your connection string includes a default database, get_default_database() will use that.
#  - Otherwise, it falls back to the DB_NAME env var or "expense_tracker".
if DB_NAME:
    db: AsyncIOMotorDatabase = client[DB_NAME]
else:
    db: AsyncIOMotorDatabase = client.get_default_database()

def get_db() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency that provides a Mongo database instance.
    """
    return db
