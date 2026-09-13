import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AcquisitionProject(Base):
    """Land acquisition project with stage pipeline, families, geometries & budgets."""

    __tablename__ = "acquisition_projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # ── Identity ──
    project_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    project_name: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    state: Mapped[str] = mapped_column(String(128), nullable=False)
    district: Mapped[str] = mapped_column(String(128), nullable=False)
    ministry: Mapped[str] = mapped_column(String(256), nullable=False, default="MoRTH")

    # ── Stage pipeline ──
    current_stage: Mapped[str] = mapped_column(String(64), nullable=False, default="proposal")
    # Stages: proposal → section11 → section19 → section24 → section41 → possession
    stage_history: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [{"stage": "proposal", "entered_at": "...", "completed_at": "..."}]

    # ── Affected families ──
    total_families: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    families_r_and_r: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    families_rehabilitated: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    families_details: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [{"family_id": "...", "head_name": "...", "displacement_type": " voluntary/involuntary", "land_holding_acres": 1.2}]

    # ── Spatial ──
    project_area_ha: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    boundary_wkt: Mapped[str | None] = mapped_column(Text, nullable=True)
    parcels_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # ── Financial ──
    total_budget_cr: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    compensation_paid_cr: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    infrastructure_budget_cr: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    expenditure_breakdown: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # {"compensation": 45.2, "rehabilitation": 12.8, "infrastructure": 89.3, "administration": 5.1}

    # ── Audit ──
    audit_checks: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [{"check": "social_impact_assessment", "status": "passed", "date": "...", "officer": "..."}]

    risk_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    delay_probability: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
