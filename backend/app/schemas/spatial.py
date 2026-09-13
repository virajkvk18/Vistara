import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class GeoTagAnalysisRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="GPS latitude")
    longitude: float = Field(..., ge=-180, le=180, description="GPS longitude")
    altitude_m: float = Field(default=0.0, description="Altitude in metres above sea level")
    gps_accuracy_m: float = Field(default=5.0, description="GPS accuracy radius in metres")
    captured_at: datetime | None = Field(default=None, description="Image capture timestamp")
    description: str = Field(default="", max_length=500, description="Optional field description")


class LandDegradationResult(BaseModel):
    severity: str
    area_ha: float
    trend: str
    confidence: int


class WaterStructureResult(BaseModel):
    detected: int
    type: str
    condition: str
    confidence: int


class VegetationIndexResult(BaseModel):
    ndvi: float
    change: float
    classification: str
    confidence: int


class SoilErosionResult(BaseModel):
    risk: str
    estimated_loss_ha_yr: float
    confidence: int


class GeoTagAnalysisResponse(BaseModel):
    image_id: uuid.UUID
    latitude: float
    longitude: float
    linked_boundary: str | None = None
    nearest_layer: str | None = None
    land_degradation: LandDegradationResult
    water_structures: WaterStructureResult
    vegetation_index: VegetationIndexResult
    soil_erosion: SoilErosionResult
    recommendation: str
    analysis_time_ms: int
    created_at: datetime

    class Config:
        from_attributes = True
