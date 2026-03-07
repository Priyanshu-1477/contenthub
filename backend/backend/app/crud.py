from sqlalchemy.orm import Session
from . import models, schemas
from .auth import security

# --- User CRUD ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Category CRUD ---
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name, parent_id=category.parent_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- Post CRUD ---
def get_posts(db: Session, skip: int = 0, limit: int = 100, category_id: int = None):
    query = db.query(models.Post)
    if category_id:
        query = query.filter(models.Post.category_id == category_id)
    return query.order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

def get_user_posts(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Post).filter(models.Post.author_id == user_id).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def create_post(db: Session, post: schemas.PostCreate, user_id: int, media_url: str = None):
    db_post = models.Post(
        title=post.title,
        content=post.content,
        media_type=post.media_type,
        category_id=post.category_id,
        author_id=user_id,
        media_url=media_url
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
