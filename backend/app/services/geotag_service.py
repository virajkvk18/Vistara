"""
Geotag Analysis Service — links GPS-tagged photos to spatial boundaries
and runs AI-based land cover / degradation analysis.

In production, this calls satellite imagery APIs (Sentinel-2, Landsat)
and ML models for classification. Here we return calibrated mock output.
"""

import random
import time
import uuid

from sqlalchemy.orm import Session

from app.models.watershed import GeotaggedImage


def analyze_geotag(
    latitude: float,
    longitude: float,
    altitude_m: float,
    gps_accuracy_m: float,
    description: str,
    db: Session,
) -> GeotaggedImage:
    """Run AI analysis on geotagged photo coordinates and persist result."""

    start = time.time()

    # ── Determine spatial context from coordinates ──
    # Delhi region (approximate bounds)
    is_delhi = 28.4 < latitude < 28.9 and 76.8 < longitude < 77.4
    is_urban = is_delhi and latitude > 28.6

    # ── Mock AI analysis calibrated by location ──
    if is_urban:
        degradation_severity = random.choice(["None", "Low", "Low"])
        ndvi_base = random.uniform(0.25, 0.45)
        water_detected = random.randint(0, 2)
        erosion_risk = random.choice(["None", "Low"])
    else:
        degradation_severity = random.choice(["None", "Low", "Moderate"])
        ndvi_base = random.uniform(0.35, 0.65)
        water_detected = random.randint(1, 5)
        erosion_risk = random.choice(["None", "Low", "Moderate"])

    ndvi_change = round(random.uniform(-0.08, 0.12), 2)
    ndvi = round(ndvi_base + ndvi_change, 2)

    # Vegetation classification
    if ndvi < 0.2:
        veg_class = "sparse"
    elif ndvi < 0.4:
        veg_class = "moderate"
    elif ndvi < 0.6:
        veg_class = "dense"
    else:
        veg_class = "very_dense"

    # Water structure detection
    water_types = ["farm pond", "check dam", "percolation tank", "none"]
    water_structures = {
        "detected": water_detected,
        "type": water_types[water_detected] if water_detected > 0 else "none",
        "condition": random.choice(["functional", "functional", "degraded"]) if water_detected > 0 else "none",
        "confidence": random.randint(72, 94),
    }

    # Soil erosion
    erosion_losses = {"None": 0.0, "Low": round(random.uniform(0.3, 1.2), 1), "Moderate": round(random.uniform(1.5, 3.5), 1)}
    soil_erosion = {
        "risk": erosion_risk,
        "estimated_loss_ha_yr": erosion_losses[erosion_risk],
        "confidence": random.randint(68, 88),
    }

    # Generate recommendation
    recommendations = []
    if degradation_severity in ("Moderate", "High"):
        recommendations.append("Initiate soil conservation measures")
    if ndvi < 0.35:
        recommendations.append("Consider afforestation drives")
    if water_detected == 0:
        recommendations.append("Evaluate check dam / farm pond construction")
    if erosion_risk != "None":
        recommendations.append("Implement contour bunding to reduce erosion")
    if not recommendations:
        recommendations.append("Current land cover appears healthy — continue monitoring")
    recommendation = "; ".join(recommendations) + "."

    elapsed_ms = int((time.time() - start) * 1000) + random.randint(600, 1800)

    image = GeotaggedImage(
        id=uuid.uuid4(),
        original_filename=f"field_photo_{uuid.uuid4().hex[:8]}.jpg",
        storage_path=f"/storage/geotag/{uuid.uuid4().hex[:12]}.jpg",
        file_size_bytes=random.randint(800_000, 4_500_000),
        mime_type="image/jpeg",
        latitude=latitude,
        longitude=longitude,
        altitude_m=altitude_m,
        gps_accuracy_m=gps_accuracy_m,
        captured_at=time.strftime("%Y-%m-%dT%H:%M:%S"),
        ai_analysis={
            "land_degradation": {
                "severity": degradation_severity,
                "area_ha": round(random.uniform(0, 15), 1) if degradation_severity != "None" else 0,
                "trend": random.choice(["stable", "improving", "declining"]),
                "confidence": random.randint(75, 95),
            },
            "water_structures": water_structures,
            "vegetation_index": {
                "ndvi": ndvi,
                "change": ndvi_change,
                "class": veg_class,
                "confidence": random.randint(80, 95),
            },
            "soil_erosion": soil_erosion,
            "recommendation": recommendation,
        },
        analysis_status="completed",
        processing_time_ms=elapsed_ms,
    )

    db.add(image)
    db.commit()
    db.refresh(image)
    return image
