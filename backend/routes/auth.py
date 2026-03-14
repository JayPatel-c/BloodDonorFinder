from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.donor import Donor
from models.hospital import Hospital
from models.admin import Admin
from schemas.auth import LoginRequest, TokenResponse
from schemas.donor import DonorCreate
from schemas.hospital import HospitalCreate
from utils.auth import hash_password, verify_password, create_access_token


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ─── Donor Registration ───────────────────────────────────────────────
@router.post("/donor/register", response_model=TokenResponse, status_code=201)
def register_donor(data: DonorCreate, db: Session = Depends(get_db)):
    """Register a new blood donor."""
    # Check if email already exists
    existing = db.query(Donor).filter(Donor.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A donor with this email already exists",
        )

    donor = Donor(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        blood_group=data.blood_group,
        age=data.age,
        gender=data.gender,
        city=data.city,
        address=data.address,
        last_donation_date=data.last_donation_date,
        medical_conditions=data.medical_conditions,
        weight=data.weight,
    )
    db.add(donor)
    db.commit()
    db.refresh(donor)

    token = create_access_token(donor.id, "donor")
    return TokenResponse(
        access_token=token,
        user_type="donor",
        user_id=donor.id,
        user_name=donor.full_name,
    )


# ─── Donor Login ──────────────────────────────────────────────────────
@router.post("/donor/login", response_model=TokenResponse)
def login_donor(data: LoginRequest, db: Session = Depends(get_db)):
    """Login as a blood donor."""
    donor = db.query(Donor).filter(Donor.email == data.email).first()
    if not donor or not verify_password(data.password, donor.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(donor.id, "donor")
    return TokenResponse(
        access_token=token,
        user_type="donor",
        user_id=donor.id,
        user_name=donor.full_name,
    )


# ─── Hospital Registration ────────────────────────────────────────────
@router.post("/hospital/register", response_model=TokenResponse, status_code=201)
def register_hospital(data: HospitalCreate, db: Session = Depends(get_db)):
    """Register a new hospital."""
    existing = db.query(Hospital).filter(Hospital.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A hospital with this email already exists",
        )

    hospital = Hospital(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        address=data.address,
        city=data.city,
        state=data.state,
        pincode=data.pincode,
        license_number=data.license_number,
        hospital_type=data.hospital_type,
        contact_person=data.contact_person,
    )
    db.add(hospital)
    db.commit()
    db.refresh(hospital)

    token = create_access_token(hospital.id, "hospital")
    return TokenResponse(
        access_token=token,
        user_type="hospital",
        user_id=hospital.id,
        user_name=hospital.name,
    )


# ─── Hospital Login ───────────────────────────────────────────────────
@router.post("/hospital/login", response_model=TokenResponse)
def login_hospital(data: LoginRequest, db: Session = Depends(get_db)):
    """Login as a hospital."""
    hospital = db.query(Hospital).filter(Hospital.email == data.email).first()
    if not hospital or not verify_password(data.password, hospital.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(hospital.id, "hospital")
    return TokenResponse(
        access_token=token,
        user_type="hospital",
        user_id=hospital.id,
        user_name=hospital.name,
    )


# ─── Admin Login ──────────────────────────────────────────────────────
@router.post("/admin/login", response_model=TokenResponse)
def login_admin(data: LoginRequest, db: Session = Depends(get_db)):
    """Login as an admin."""
    admin = db.query(Admin).filter(Admin.email == data.email).first()
    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(admin.id, "admin")
    return TokenResponse(
        access_token=token,
        user_type="admin",
        user_id=admin.id,
        user_name=admin.full_name,
    )
