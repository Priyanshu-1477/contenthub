from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routes import auth, posts, categories
import os

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Content Hub API")

# Setup CORS to allow the frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])

@app.get("/")
def root():
    return {"message": "Welcome to the Content Hub API!"}
