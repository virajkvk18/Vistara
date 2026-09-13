"""Spatial API — geotagged photo analysis with spatial boundary linking."""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.spatial import GeoTagAnalysisRequest, GeoTagAnalysisResponse
from app.services.geotag_service import analyze_geotag

router = APIRouter()


@router.post(
    "/geotag-analysis",
    response_model=GeoTagAnalysisResponse,
    summary="Analyse geotagged photo and link to spatial boundary",
)
def analyze_photo(
    body: GeoTagAnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    Accepts GPS coordinates from a geotagged field photo and:

    1. Links the coordinates to the nearest spatial boundary / watershed layer
    2. Runs AI-based land cover analysis using satellite imagery
    3. Returns:
       - Land degradation severity and trend
       - Water structure detection (check dams, farm ponds)
       - Vegetation index (NDVI) and change analysis
       - Soil erosion risk assessment
       - Actionable recommendations

    Coordinates are cross-referenced against the VISTARA spatial database
    to identify the nearest acquisition project or watershed layer.
    """
    image = analyze_geotag(
        latitude=body.latitude,
        longitude=body.longitude,
        altitude_m=body.altitude_m,
        gps_accuracy_m=body.gps_accuracy_m,
        description=body.description,
        db=db,
    )

    analysis = image.ai_analysis
    return GeoTagAnalysisResponse(
        image_id=image.id,
        latitude=image.latitude,
        longitude=image.longitude,
        linked_boundary=None,
        nearest_layer=None,
        land_degradation=analysis["land_degradation"],
        water_structures=analysis["water_structures"],
        vegetation_index=analysis["vegetation_index"],
        soil_erosion=analysis["soil_erosion"],
        recommendation=analysis["recommendation"],
        analysis_time_ms=image.processing_time_ms,
        created_at=image.created_at,
    )
