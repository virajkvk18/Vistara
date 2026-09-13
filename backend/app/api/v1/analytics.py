"""Analytics API — ML delay prediction with SHAP explainability."""

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analytics import PredictDelayRequest, PredictDelayResponse
from app.services.delay_prediction_service import predict_delay

router = APIRouter()


@router.post(
    "/predict-delay",
    response_model=PredictDelayResponse,
    summary="Run ML delay prediction for an acquisition project",
)
def predict_project_delay(
    body: PredictDelayRequest,
    db: Session = Depends(get_db),
):
    """
    Runs delay prediction model on the specified acquisition project.

    Returns:
    - Predicted delay in days
    - Delay probability and confidence
    - SHAP feature importance breakdown
    - Risk category (Minimal / Low / Moderate / High / Critical)
    - Mitigation recommendations with estimated days saved
    """
    try:
        prediction = predict_delay(project_id=body.project_id, db=db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return PredictDelayResponse.model_validate(prediction)
