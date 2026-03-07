import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
import aiofiles
from typing import List

from .. import schemas, crud, models, database
from .auth import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/", response_model=schemas.PostResponse)
async def create_new_post(
    title: str = Form(...),
    content: str = Form(None),
    media_type: models.MediaType = Form(models.MediaType.blog),
    category_id: int = Form(...),
    subcategory_name: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    media_url = None
    if file:
        file_path = f"{UPLOAD_DIR}/{current_user.id}_{file.filename}"
        async with aiofiles.open(file_path, 'wb') as out_file:
            while content_chunk := await file.read(1024 * 1024):  # read 1MB at a time
                await out_file.write(content_chunk)
        media_url = file_path

    final_category_id = category_id
    if subcategory_name:
        subcat = db.query(models.Category).filter(
            models.Category.name == subcategory_name,
            models.Category.parent_id == category_id
        ).first()

        if not subcat:
            new_cat = schemas.CategoryCreate(name=subcategory_name, parent_id=category_id)
            subcat = crud.create_category(db, new_cat)
        
        final_category_id = subcat.id

    post_data = schemas.PostCreate(
        title=title, 
        content=content, 
        media_type=media_type, 
        category_id=final_category_id
    )
    return crud.create_post(db=db, post=post_data, user_id=current_user.id, media_url=media_url)


@router.get("/", response_model=List[schemas.PostResponse])
def read_posts(skip: int = 0, limit: int = 100, category_id: int = None, db: Session = Depends(database.get_db)):
    posts = crud.get_posts(db, skip=skip, limit=limit, category_id=category_id)
    return posts

@router.get("/user/me", response_model=List[schemas.PostResponse])
def read_user_posts(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_user_posts(db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/{post_id}", response_model=schemas.PostResponse)
def read_post(post_id: int, db: Session = Depends(database.get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.get("/{post_id}/stream")
def stream_video(post_id: int, request: Request, db: Session = Depends(database.get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None or not db_post.media_url or db_post.media_type != models.MediaType.video:
        raise HTTPException(status_code=404, detail="Video not found")

    file_path = db_post.media_url
    file_size = os.path.getsize(file_path)
    range_header = request.headers.get("range")

    if not range_header:
        # Default full file response if no range header
        return FileResponse(file_path, media_type="video/mp4")
    
    # Process Range header (e.g., "bytes=100-200")
    try:
        byte_range = range_header.replace("bytes=", "").split("-")
        start = int(byte_range[0])
        end = int(byte_range[1]) if byte_range[1] else file_size - 1
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Range Header")

    start = max(0, start)
    end = min(file_size - 1, end)
    chunk_size = (end - start) + 1

    def file_iterator(file_path, start, chunk_size):
        with open(file_path, "rb") as video:
            video.seek(start)
            bytes_sent = 0
            while bytes_sent < chunk_size:
                chunk = video.read(min(chunk_size - bytes_sent, 1024 * 1024)) # 1MB chunks
                if not chunk:
                    break
                bytes_sent += len(chunk)
                yield chunk

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(chunk_size),
        "Content-Type": "video/mp4",
    }

    return StreamingResponse(
        file_iterator(file_path, start, chunk_size),
        status_code=206,
        headers=headers
    )


@router.get("/{post_id}/download")
def download_media(post_id: int, db: Session = Depends(database.get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None or not db_post.media_url:
        raise HTTPException(status_code=404, detail="Media not found")
        
    return FileResponse(
        db_post.media_url, 
        media_type="application/octet-stream",
        filename=os.path.basename(db_post.media_url)
    )
