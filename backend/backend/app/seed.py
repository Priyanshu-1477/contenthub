from backend.app.database import engine, SessionLocal
from backend.app.models import Base, Category

def seed_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables from scratch with new schema...")
    Base.metadata.create_all(bind=engine)
    
    print("Seeding root categories...")
    db = SessionLocal()
    
    root_categories = [
        "Education",
        "Sports",
        "Computer",
        "General Knowledge",
        "Science",
        "Technology",
        "Arts",
        "History",
        "Entertainment"
    ]
    
    for cat_name in root_categories:
        existing = db.query(Category).filter(Category.name == cat_name).first()
        if not existing:
            cat = Category(name=cat_name)
            db.add(cat)
            
    db.commit()
    print("Seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()
