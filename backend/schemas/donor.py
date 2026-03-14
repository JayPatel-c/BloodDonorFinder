from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class DonorCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str
    blood_group: str
    age: int
    gender: str
    city: str
    address: Optional[str] = None
    last_donation_date: Optional[date] = None
    medical_conditions: Optional[str] = None
    weight: Optional[int] = None


class DonorUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    is_available: Optional[bool] = None
    last_donation_date: Optional[date] = None
    medical_conditions: Optional[str] = None
    weight: Optional[int] = None


class DonorResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    blood_group: str
    age: int
    gender: str
    city: str
    address: Optional[str] = None
    last_donation_date: Optional[date] = None
    is_available: bool
    medical_conditions: Optional[str] = None
    weight: Optional[int] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class DonorSearchParams(BaseModel):
    blood_group: Optional[str] = None
    city: Optional[str] = None
    is_available: Optional[bool] = None
