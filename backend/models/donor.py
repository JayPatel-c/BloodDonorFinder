from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    blood_group = Column(String(5), nullable=False, index=True)  # A+, A-, B+, B-, AB+, AB-, O+, O-
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)  # Male, Female, Other
    city = Column(String(100), nullable=False, index=True)
    address = Column(Text, nullable=True)
    last_donation_date = Column(Date, nullable=True)
    is_available = Column(Boolean, default=True)
    medical_conditions = Column(Text, nullable=True)
    weight = Column(Integer, nullable=True)  # in kg
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
