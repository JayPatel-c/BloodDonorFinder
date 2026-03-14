from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from utils.auth import decode_access_token
from models.donor import Donor
from models.hospital import Hospital
from models.admin import Admin
import jwt


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Extract and validate the current user from the JWT token."""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user_id = int(payload["sub"])
    user_type = payload["user_type"]

    if user_type == "donor":
        user = db.query(Donor).filter(Donor.id == user_id).first()
    elif user_type == "hospital":
        user = db.query(Hospital).filter(Hospital.id == user_id).first()
    elif user_type == "admin":
        user = db.query(Admin).filter(Admin.id == user_id).first()
    else:
        raise HTTPException(status_code=401, detail="Invalid user type")

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return {"user": user, "user_type": user_type}


def require_admin(current_user: dict = Depends(get_current_user)):
    """Dependency that requires the current user to be an admin."""
    if current_user["user_type"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


def require_donor(current_user: dict = Depends(get_current_user)):
    """Dependency that requires the current user to be a donor."""
    if current_user["user_type"] != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Donor access required",
        )
    return current_user


def require_hospital(current_user: dict = Depends(get_current_user)):
    """Dependency that requires the current user to be a hospital."""
    if current_user["user_type"] != "hospital":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hospital access required",
        )
    return current_user
