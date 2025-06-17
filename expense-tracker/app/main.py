from datetime import timedelta
from typing import List

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from .database import get_db
from .schemas import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseOut,
    UserCreate,
    UserOut,
    Token,
)
from .crud import (
    create_expense,
    get_expense,
    get_expenses,
    update_expense,
    delete_expense,
)
from .auth import (
    create_user,
    authenticate_user,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

app = FastAPI(title="Expense Tracker API")

# Enable CORS for frontend-backend interaction (in prod, use a whitelist)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # CHANGE this in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Authentication Endpoints ──────────────────────────────

@app.get("/healthz")
async def healthz(db=Depends(get_db)):
    try:
        # Try simple MongoDB command to confirm connection
        colls = await db.list_collection_names()
        return {"ok": True, "collections": colls}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
async def register(user: UserCreate, db=Depends(get_db)):
    existing = await db["users"].find_one({"username": user.username})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    return await create_user(db, user)

@app.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db),
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserOut)
async def read_users_me(current_user=Depends(get_current_user)):
    return current_user

# ── Expense Endpoints (per user) ─────────────────────────

@app.post(
    "/expenses",
    response_model=ExpenseOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_expense(
    expense: ExpenseCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await create_expense(db, expense, current_user.id)

@app.get(
    "/expenses",
    response_model=List[ExpenseOut],
)
async def list_expenses(
    skip: int = 0,
    limit: int = 100,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await get_expenses(db, current_user.id, skip, limit)

@app.get(
    "/expenses/{id}",
    response_model=ExpenseOut,
)
async def fetch_expense(
    id: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    exp = await get_expense(db, id, current_user.id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    return exp

@app.put(
    "/expenses/{id}",
    response_model=ExpenseOut,
)
async def edit_expense(
    id: str,
    expense: ExpenseUpdate,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    exp = await update_expense(db, id, expense, current_user.id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    return exp

@app.delete(
    "/expenses/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_expense(
    id: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    deleted = await delete_expense(db, id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    return
