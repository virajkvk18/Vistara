"""
VISTARA — National Digital Infrastructure for Land Governance
FastAPI Backend Entry Point

Run with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import router as v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # ── Startup ──
    # Uncomment when PostgreSQL is available:
    # from app.database import init_db
    # init_db()
    yield
    # ── Shutdown ──


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "REST API for the VISTARA National Land Governance Platform.\n\n"
        "Modules:\n"
        "- **Digitize** — OCR extraction from scanned land documents\n"
        "- **Acquisition** — Project lifecycle & stage pipeline management\n"
        "- **Analytics** — ML delay prediction with SHAP explainability\n"
        "- **Research** — RAG-powered policy knowledge search\n"
        "- **Spatial** — Geotagged photo analysis & spatial boundary linking"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ── CORS — allow Next.js frontend ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API v1 routes ──
app.include_router(v1_router, prefix=settings.API_V1_PREFIX)


# ── Health check ──
@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "VISTARA API",
        "version": settings.VERSION,
    }


@app.get("/", tags=["System"])
def root():
    return {
        "service": "VISTARA — National Digital Infrastructure for Land Governance",
        "version": settings.VERSION,
        "docs": "/docs",
        "api": settings.API_V1_PREFIX,
    }
