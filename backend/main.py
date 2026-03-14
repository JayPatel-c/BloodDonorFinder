from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth, donors, hospitals, admin


# Create all database tables
Base.metadata.create_all(bind=engine)


# ─── FastAPI App ──────────────────────────────────────────────────────
app = FastAPI(
    title="BloodDonorFinder API",
    description="Backend API for the Blood Donor Finder (BloodLink) application",
    version="1.0.0",
)

# ─── CORS (allow Next.js frontend) ───────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routes ─────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(donors.router)
app.include_router(hospitals.router)
app.include_router(admin.router)


# ─── Health Check ─────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def health_check():
    return {"status": "healthy", "app": "BloodDonorFinder API"}
