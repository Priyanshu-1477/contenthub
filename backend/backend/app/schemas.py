from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import MediaType

# --- Tokens ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- User ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Category ---
class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# Subcategories support in response
class CategoryTreeResponse(CategoryResponse):
    subcategories: List['CategoryTreeResponse'] = []

# --- Post ---
class PostBase(BaseModel):
    title: str
    content: Optional[str] = None
    media_type: MediaType = MediaType.blog
    category_id: Optional[int] = None

class PostCreate(PostBase):
    pass
    # media_url will be handled separately during upload

class PostResponse(PostBase):
    id: int
    media_url: Optional[str] = None
    author_id: int
    created_at: datetime
    
    author: UserResponse
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
