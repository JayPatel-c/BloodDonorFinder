from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.hospital import Hospital
from schemas.hospital import HospitalResponse
from utils.dependencies import require_hospital


router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])


# ─── Get My Hospital Profile ──────────────────────────────────────────
@router.get("/me", response_model=HospitalResponse)
def get_my_hospital(current_user: dict = Depends(require_hospital)):
    """Get the logged-in hospital's profile."""
    return current_user["user"]
