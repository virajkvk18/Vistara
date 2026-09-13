"""
OCR Service — simulates EasyOCR / PaddleOCR extraction pipeline.

In production this would call actual OCR models. For the demo we return
realistic mock output with calibrated confidence scores.
"""

import random
import time
import uuid

from sqlalchemy.orm import Session

from app.models.digitized_record import DigitizedRecord


# ── Mock extraction templates by document type ──

_DEED_TEMPLATES = [
    {
        "fields": {
            "survey_number": "14/2",
            "owner_name": "Smt. Kamla Devi",
            "area_acres": 1.85,
            "village": "Bawana",
            "district": "North West Delhi",
            "state": "Delhi",
            "land_type": "Agricultural",
            "date_of_deed": "2015-03-22",
        },
        "confidence": {
            "survey_number": 0.94,
            "owner_name": 0.91,
            "area_acres": 0.82,
            "village": 0.88,
            "district": 0.96,
            "state": 0.99,
            "land_type": 0.79,
            "date_of_deed": 0.73,
        },
        "raw_text": (
            "DEED OF SALE EXECUTED ON 22-MARCH-2015\n"
            "Between: Smt. Kamla Devi, W/o Sh. Ram Niwas\n"
            "Village: Bawana, District: North West Delhi\n"
            "Survey No. 14/2, Area: 1 Acre 34 Gunthas (1.85 Acres)\n"
            "Land Type: Agricultural\n"
            "Consideration: Rs. 18,50,000/-\n"
            "Registered at: Sub-Registrar Office, Kanjhawala"
        ),
    },
    {
        "fields": {
            "survey_number": "7/3",
            "owner_name": "Sh. Ramesh Kumar",
            "area_acres": 3.12,
            "village": "Laluwasane",
            "district": "South West Delhi",
            "state": "Delhi",
            "land_type": "Agricultural",
            "date_of_deed": "2018-11-05",
        },
        "confidence": {
            "survey_number": 0.89,
            "owner_name": 0.85,
            "area_acres": 0.78,
            "village": 0.92,
            "district": 0.94,
            "state": 0.98,
            "land_type": 0.76,
            "date_of_deed": 0.68,
        },
        "raw_text": (
            "SALE DEED — REGISTERED DOCUMENT\n"
            "Date: 05-November-2018\n"
            "Vendor: Sh. Ramesh Kumar, S/o Sh. Hari Singh\n"
            "Village: Laluwasane, Tehsil: Kanjhawala\n"
            "District: South West Delhi, State: Delhi\n"
            "Survey No: 7/3, Area: 2 Acres 19 Gunthas (3.12 Acres)\n"
            "Nature: Agricultural Land\n"
            "Sale Consideration: Rs. 31,20,000/-"
        ),
    },
    {
        "fields": {
            "survey_number": "22/1A",
            "owner_name": "Smt. Priya Sharma",
            "area_acres": 0.75,
            "village": "Najafgarh",
            "district": "South West Delhi",
            "state": "Delhi",
            "land_type": "Residential",
            "date_of_deed": "2022-07-18",
        },
        "confidence": {
            "survey_number": 0.91,
            "owner_name": 0.88,
            "area_acres": 0.93,
            "village": 0.95,
            "district": 0.97,
            "state": 0.99,
            "land_type": 0.84,
            "date_of_deed": 0.90,
        },
        "raw_text": (
            "CONVEYANCE DEED\n"
            "Executed: 18-July-2022\n"
            "Purchaser: Smt. Priya Sharma, D/o Sh. Ashok Sharma\n"
            "Property: Plot No. 22/1A, Village Najafgarh\n"
            "District: South West Delhi\n"
            "Area: 750 Sq.Yards (0.75 Acres)\n"
            "Type: Residential\n"
            "Stamp Duty: Rs. 4,12,500/-"
        ),
    },
]


def process_ocr(file_bytes: bytes, filename: str, db: Session) -> DigitizedRecord:
    """Run mock OCR pipeline and persist extracted record."""
    start = time.time()

    # Pick a template based on file hash for deterministic results
    template = _DEED_TEMPLATES[hash(filename) % len(_DEED_TEMPLATES)]

    # Add realistic noise to confidence scores
    noisy_confidence = {}
    for field, base_score in template["confidence"].items():
        noise = random.uniform(-0.05, 0.05)
        noisy_confidence[field] = round(max(0.1, min(1.0, base_score + noise)), 2)

    overall = round(sum(noisy_confidence.values()) / len(noisy_confidence), 2)
    needs_review = overall < 0.80

    elapsed_ms = int((time.time() - start) * 1000) + random.randint(800, 2500)

    record = DigitizedRecord(
        id=uuid.uuid4(),
        original_filename=filename,
        file_size_bytes=len(file_bytes),
        mime_type="image/jpeg",
        ocr_engine="easyocr",
        raw_text=template["raw_text"],
        extracted_fields=template["fields"],
        confidence_scores=noisy_confidence,
        overall_confidence=overall,
        requires_human_review=needs_review,
        centroid_lat=28.6139 + random.uniform(-0.05, 0.05),
        centroid_lng=77.2090 + random.uniform(-0.05, 0.05),
        processing_time_ms=elapsed_ms,
        status="completed" if not needs_review else "needs_review",
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record
