"""Digitize API — file upload + OCR extraction."""

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.digitize import DigitizeResponse
from app.services.ocr_service import process_ocr

router = APIRouter()


@router.post("/process", response_model=DigitizeResponse, summary="Process uploaded land document via OCR")
async def process_digitize(
    file: UploadFile = File(..., description="Scanned land deed / document image"),
    db: Session = Depends(get_db),
):
    """
    Accepts a file upload (JPEG, PNG, PDF) and runs OCR extraction pipeline.

    Returns extracted fields (survey number, owner name, area, village, district,
    state, land type, deed date) with per-field confidence scores.
    Documents with overall confidence < 80% are flagged for human review.
    """
    contents = await file.read()
    record = process_ocr(
        file_bytes=contents,
        filename=file.filename or "unknown.jpg",
        db=db,
    )
    return DigitizeResponse.model_validate(record)
