from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class MediaType(str, enum.Enum):
    blog = "blog"
    image = "image"
    video = "video"
    pdf = "pdf"
    document = "document"
    spreadsheet = "spreadsheet"
    audio = "audio"
    archive = "archive"
    other = "other"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    posts = relationship("Post", back_populates="author")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    posts = relationship("Post", back_populates="category")
    subcategories = relationship("Category", backref="parent", remote_side=[id])

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=True) # Text for blogs, optional for pure media
    media_type = Column(Enum(MediaType), default=MediaType.blog, nullable=False)
    media_url = Column(String, nullable=True) # URL or path to the uploaded file
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    author = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")
