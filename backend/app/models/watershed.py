import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WatershedLayer(Base):
    """GIS watershed layer with toggles, temporal data & change analytics."""

    __tablename__ = "watershed_layers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    layer_key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    color: Mapped[str] = mapped_column(String(16), nullable=False, default="#34d399")
    source: Mapped[str] = mapped_column(String(128), nullable=False, default="Sentinel-2")
    resolution: Mapped[str] = mapped_column(String(32), nullable=False, default="10m")

    # ── Temporal coverage ──
    time_periods: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [{"period": "2022", "ndvi_mean": 0.42, "vegetation_cover_pct": 34.2, "soil_moisture_anomaly": -0.8, "water_bodies": 3}]

    # ── Spatial extent ──
    bounds_wkt: Mapped[str | None] = mapped_column(Text, nullable=True)
    centroid_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    centroid_lng: Mapped[float | None] = mapped_column(Float, nullable=True)

    # ── Metadata ──
    metadata_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)


class GeotaggedImage(Base):
    """GPS-tagged field photo with satellite mapping and AI analysis metadata."""

    __tablename__ = "geotagged_images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # ── File ──
    original_filename: Mapped[str] = mapped_column(String(512), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mime_type: Mapped[str] = mapped_column(String(128), nullable=False, default="image/jpeg")

    # ── GPS ──
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    altitude_m: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    gps_accuracy_m: Mapped[float] = mapped_column(Float, nullable=False, default=5.0)
    captured_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    # ── Spatial link ──
    linked_layer_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    linked_boundary_wkt: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ── AI analysis output ──
    ai_analysis: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # {
    #   "land_degradation": {"severity": "Low", "area_ha": 12.3, "trend": "stable", "confidence": 82},
    #   "water_structures": {"detected": 2, "type": "check dam", "condition": "functional", "confidence": 76},
    #   "vegetation_index": {"ndvi": 0.58, "change": 0.04, "class": "moderate", "confidence": 88},
    #   "soil_erosion": {"risk": "Low", "estimated_loss_ha_yr": 0.8, "confidence": 71},
    #   "recommendation": "..."
    # }

    # ── Processing ──
    analysis_status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")
    # Status: pending | processing | completed | failed
    processing_time_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
