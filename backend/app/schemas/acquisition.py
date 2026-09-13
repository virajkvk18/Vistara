import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class AcquisitionProjectBrief(BaseModel):
    id: uuid.UUID
    project_code: str
    project_name: str
    state: str
    district: str
    ministry: str
    current_stage: str
    total_families: int
    families_rehabilitated: int
    project_area_ha: float
    total_budget_cr: float
    compensation_paid_cr: float
    risk_score: float
    delay_probability: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StageUpdateRequest(BaseModel):
    new_stage: str = Field(
        ...,
        description="Next stage in pipeline: proposal | section11 | section19 | section24 | section41 | possession",
        examples=["section11"],
    )
    officer: str = Field(default="system", description="Officer or system process initiating the update")
    notes: str = Field(default="", description="Optional notes for the stage transition")


class StageUpdateResponse(BaseModel):
    project_id: uuid.UUID
    project_code: str
    previous_stage: str
    new_stage: str
    updated_at: datetime
    stage_history: list[dict]

    class Config:
        from_attributes = True


class AuditCheck(BaseModel):
    check: str
    status: str
    date: str
    officer: str


class FamilyDetail(BaseModel):
    family_id: str
    head_name: str
    displacement_type: str
    land_holding_acres: float
    compensation_amount: float = 0.0
    r_and_r_status: str = "pending"
