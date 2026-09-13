import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class PredictDelayRequest(BaseModel):
    project_id: uuid.UUID = Field(
        ...,
        description="UUID of the acquisition project to predict delays for",
    )


class ShapFeature(BaseModel):
    feature: str
    impact: float = Field(description="SHAP value; positive = increases delay")
    direction: str = Field(description="positive | negative")
    description: str


class MitigationAction(BaseModel):
    action: str
    priority: str = Field(description="critical | high | medium")
    estimated_days_saved: int


class PredictDelayResponse(BaseModel):
    prediction_id: uuid.UUID
    project_id: uuid.UUID
    project_code: str
    project_name: str
    predicted_delay_days: int
    delay_probability: float
    confidence: float
    risk_category: str
    shap_features: list[ShapFeature]
    risk_breakdown: dict[str, float]
    mitigation_advice: list[MitigationAction]
    model_version: str
    inference_time_ms: int
    created_at: datetime

    class Config:
        from_attributes = True
