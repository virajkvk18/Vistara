import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DigitizedRecord(Base):
    """OCR-extracted land record with confidence scores and spatial boundaries."""

    __tablename__ = "digitized_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # ── Source file metadata ──
    original_filename: Mapped[str] = mapped_column(String(512), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(128), nullable=False, default="image/jpeg")

    # ── OCR engine output ──
    ocr_engine: Mapped[str] = mapped_column(String(64), nullable=False, default="easyocr")
    raw_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    extracted_fields: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # Example extracted_fields:
    # {
    #   "survey_number": "12/3",
    #   "owner_name": "Ramesh Kumar",
    #   "area_acres": 2.35,
    #   "village": "Laluwasane",
    #   "district": "South West Delhi",
    #   "state": "Delhi",
    #   "land_type": "Agricultural",
    #   "date_of_deed": "2018-06-15"
    # }

    confidence_scores: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # Example: {"survey_number": 0.92, "owner_name": 0.87, "area_acres": 0.78}

    overall_confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    requires_human_review: Mapped[bool] = mapped_column(default=False)

    # ── Spatial boundary (PostGIS) ──
    # Using WKT string for spatial boundary; PostGIS Geometry column added via raw SQL
    boundary_wkt: Mapped[str | None] = mapped_column(Text, nullable=True)
    centroid_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    centroid_lng: Mapped[float | None] = mapped_column(Float, nullable=True)

    # ── Processing metadata ──
    processing_time_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")
    # Status: pending | processing | completed | failed | needs_review

    reviewed_by: Mapped[str | None] = mapped_column(String(256), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
