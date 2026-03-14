"""
Run this script once to create a default admin user.
Usage: python seed_admin.py
"""
from database import SessionLocal, engine, Base
from models.admin import Admin
from utils.auth import hash_password

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if admin already exists
existing = db.query(Admin).filter(Admin.email == "admin@bloodlink.com").first()
if existing:
    print("Admin user already exists!")
else:
    admin = Admin(
        email="admin@bloodlink.com",
        password_hash=hash_password("admin123"),
        full_name="System Admin",
    )
    db.add(admin)
    db.commit()
    print("Default admin created successfully!")
    print("  Email:    admin@bloodlink.com")
    print("  Password: admin123")

db.close()
