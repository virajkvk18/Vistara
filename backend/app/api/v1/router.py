"""VISTARA API v1 — aggregates all route modules."""

from fastapi import APIRouter

from app.api.v1.digitize import router as digitize_router
from app.api.v1.acquisition import router as acquisition_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.research import router as research_router
from app.api.v1.spatial import router as spatial_router

router = APIRouter()

router.include_router(digitize_router, prefix="/digitize", tags=["Digitize"])
router.include_router(acquisition_router, prefix="/acquisition", tags=["Acquisition"])
router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
router.include_router(research_router, prefix="/research", tags=["Research"])
router.include_router(spatial_router, prefix="/spatial", tags=["Spatial"])
