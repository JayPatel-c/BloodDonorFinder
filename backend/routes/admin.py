from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.donor import Donor
from models.hospital import Hospital
from schemas.donor import DonorResponse
from schemas.hospital import HospitalResponse
from utils.dependencies import require_admin


router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ─── Get All Donors ───────────────────────────────────────────────────
@router.get("/donors", response_model=list[DonorResponse])
def get_all_donors(
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get all registered donors. Admin only."""
    return db.query(Donor).order_by(Donor.created_at.desc()).all()


# ─── Get All Hospitals ────────────────────────────────────────────────
@router.get("/hospitals", response_model=list[HospitalResponse])
def get_all_hospitals(
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get all registered hospitals. Admin only."""
    return db.query(Hospital).order_by(Hospital.created_at.desc()).all()


# ─── Delete a Donor ───────────────────────────────────────────────────
@router.delete("/donors/{donor_id}", status_code=204)
def delete_donor(
    donor_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Delete a donor by ID. Admin only."""
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor not found",
        )
    db.delete(donor)
    db.commit()


# ─── Delete a Hospital ────────────────────────────────────────────────
@router.delete("/hospitals/{hospital_id}", status_code=204)
def delete_hospital(
    hospital_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Delete a hospital by ID. Admin only."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital not found",
        )
    db.delete(hospital)
    db.commit()


# ─── Verify a Hospital ────────────────────────────────────────────────
@router.patch("/hospitals/{hospital_id}/verify", response_model=HospitalResponse)
def verify_hospital(
    hospital_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Mark a hospital as verified. Admin only."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital not found",
        )
    hospital.is_verified = True
    db.commit()
    db.refresh(hospital)
    return hospital


# ─── Dashboard Stats ──────────────────────────────────────────────────
@router.get("/stats")
def get_dashboard_stats(
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get dashboard statistics. Admin only."""
    total_donors = db.query(Donor).count()
    available_donors = db.query(Donor).filter(Donor.is_available == True).count()
    total_hospitals = db.query(Hospital).count()
    verified_hospitals = db.query(Hospital).filter(Hospital.is_verified == True).count()

    # Blood group distribution
    blood_groups = {}
    for bg in ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]:
        count = db.query(Donor).filter(Donor.blood_group == bg).count()
        blood_groups[bg] = count

    return {
        "total_donors": total_donors,
        "available_donors": available_donors,
        "total_hospitals": total_hospitals,
        "verified_hospitals": verified_hospitals,
        "blood_group_distribution": blood_groups,
    }
