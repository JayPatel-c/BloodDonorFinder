from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models.donor import Donor
from schemas.donor import DonorResponse, DonorUpdate
from utils.dependencies import require_donor


router = APIRouter(prefix="/api/donors", tags=["Donors"])


# ─── Search Donors (Public) ───────────────────────────────────────────
@router.get("/search", response_model=list[DonorResponse])
def search_donors(
    blood_group: Optional[str] = Query(None, description="Filter by blood group (e.g. A+, O-)"),
    city: Optional[str] = Query(None, description="Filter by city"),
    is_available: Optional[bool] = Query(None, description="Filter by availability"),
    db: Session = Depends(get_db),
):
    """Search for blood donors with optional filters. Public endpoint."""
    query = db.query(Donor)

    if blood_group:
        query = query.filter(Donor.blood_group == blood_group)
    if city:
        query = query.filter(Donor.city.ilike(f"%{city}%"))
    if is_available is not None:
        query = query.filter(Donor.is_available == is_available)

    donors = query.order_by(Donor.created_at.desc()).limit(50).all()
    return donors


# ─── Get My Profile (Donor) ───────────────────────────────────────────
@router.get("/me", response_model=DonorResponse)
def get_my_profile(current_user: dict = Depends(require_donor)):
    """Get the logged-in donor's profile."""
    return current_user["user"]


# ─── Update My Profile (Donor) ────────────────────────────────────────
@router.put("/me", response_model=DonorResponse)
def update_my_profile(
    data: DonorUpdate,
    current_user: dict = Depends(require_donor),
    db: Session = Depends(get_db),
):
    """Update the logged-in donor's profile."""
    donor = current_user["user"]
    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(donor, field, value)

    db.commit()
    db.refresh(donor)
    return donor
