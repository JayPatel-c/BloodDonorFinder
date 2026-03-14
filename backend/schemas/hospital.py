from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class HospitalCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    city: str
    state: Optional[str] = None
    pincode: Optional[str] = None
    license_number: Optional[str] = None
    hospital_type: Optional[str] = None
    contact_person: Optional[str] = None


class HospitalResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    address: str
    city: str
    state: Optional[str] = None
    pincode: Optional[str] = None
    license_number: Optional[str] = None
    hospital_type: Optional[str] = None
    contact_person: Optional[str] = None
    is_verified: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
