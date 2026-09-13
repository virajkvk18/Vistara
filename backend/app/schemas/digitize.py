import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class DigitizeRequest(BaseModel):
    """Accepts a file upload reference; actual file handled by FastAPI UploadFile."""
    pass


class ExtractedFields(BaseModel):
    survey_number: str | None = None
    owner_name: str | None = None
    area_acres: float | None = None
    village: str | None = None
    district: str | None = None
    state: str | None = None
    land_type: str | None = None
    date_of_deed: str | None = None


class ConfidenceScores(BaseModel):
    survey_number: float = 0.0
    owner_name: float = 0.0
    area_acres: float = 0.0
    village: float = 0.0
    district: float = 0.0
    state: float = 0.0
    land_type: float = 0.0
    date_of_deed: float = 0.0


class DigitizeResponse(BaseModel):
    record_id: uuid.UUID
    ocr_engine: str
    raw_text: str
    extracted_fields: dict[str, str | float | None]
    confidence_scores: dict[str, float]
    overall_confidence: float
    requires_human_review: bool
    processing_time_ms: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class DigitizeStatusResponse(BaseModel):
    record_id: uuid.UUID
    status: str
    overall_confidence: float
    requires_human_review: bool
    processing_time_ms: int
