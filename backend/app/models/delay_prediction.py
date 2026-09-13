import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DelayPrediction(Base):
    """ML delay prediction output with SHAP feature importance and mitigation advice."""

    __tablename__ = "delay_predictions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # ── Linked project ──
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    project_code: Mapped[str] = mapped_column(String(64), nullable=False)
    project_name: Mapped[str] = mapped_column(String(512), nullable=False)

    # ── Prediction output ──
    predicted_delay_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    delay_probability: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    risk_category: Mapped[str] = mapped_column(String(32), nullable=False, default="Moderate")
    # Risk categories: Minimal | Low | Moderate | High | Critical

    # ── SHAP feature importance ──
    # Stores array of { feature, impact, direction, description }
    shap_features: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [
    #   {"feature": "bureaucratic_delay", "impact": 0.34, "direction": "positive", "description": "..."},
    #   {"feature": "environmental_clearance", "impact": 0.22, "direction": "positive", "description": "..."},
    #   {"feature": "consent_percentage", "impact": -0.15, "direction": "negative", "description": "..."},
    # ]

    # ── Risk breakdown by category ──
    risk_breakdown: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # {"legal": 0.28, "financial": 0.19, "bureaucratic": 0.34, "environmental": 0.12, "social": 0.07}

    # ── Mitigation recommendations ──
    mitigation_advice: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [
    #   {"action": "Fast-track Section 19 hearing", "priority": "critical", "estimated_days_saved": 45},
    #   {"action": "Engage District Collector for R&R acceleration", "priority": "high", "estimated_days_saved": 30},
    # ]

    # ── Model metadata ──
    model_version: Mapped[str] = mapped_column(String(32), nullable=False, default="v1.0")
    inference_time_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    input_features: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
