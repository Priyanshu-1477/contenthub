from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud, database

router = APIRouter()

@router.get("/", response_model=List[schemas.CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

@router.post("/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(database.get_db)):
    return crud.create_category(db=db, category=category)
