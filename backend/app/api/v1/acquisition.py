"""Acquisition API — project lifecycle management."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.acquisition_project import AcquisitionProject
from app.schemas.acquisition import (
    AcquisitionProjectBrief,
    StageUpdateRequest,
    StageUpdateResponse,
)

router = APIRouter()

VALID_STAGES = ["proposal", "section11", "section19", "section24", "section41", "possession"]


@router.get(
    "/projects",
    response_model=list[AcquisitionProjectBrief],
    summary="List all acquisition projects",
)
def list_projects(
    state: str | None = Query(default=None, description="Filter by state"),
    stage: str | None = Query(default=None, description="Filter by current stage"),
    db: Session = Depends(get_db),
):
    """Returns all acquisition projects with pipeline status, family counts & budgets."""
    q = db.query(AcquisitionProject)
    if state:
        q = q.filter(AcquisitionProject.state == state)
    if stage:
        q = q.filter(AcquisitionProject.current_stage == stage)
    projects = q.order_by(AcquisitionProject.created_at.desc()).all()
    return [AcquisitionProjectBrief.model_validate(p) for p in projects]


@router.get(
    "/projects/{project_id}",
    response_model=AcquisitionProjectBrief,
    summary="Get a single acquisition project",
)
def get_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    project = db.query(AcquisitionProject).filter(AcquisitionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return AcquisitionProjectBrief.model_validate(project)


@router.patch(
    "/projects/{project_id}/stage",
    response_model=StageUpdateResponse,
    summary="Advance project to next pipeline stage",
)
def update_stage(
    project_id: uuid.UUID,
    body: StageUpdateRequest,
    db: Session = Depends(get_db),
):
    """
    Advances an acquisition project to a new pipeline stage.

    Validates stage ordering and records the transition in stage_history
    with officer name and timestamp.
    """
    project = db.query(AcquisitionProject).filter(AcquisitionProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if body.new_stage not in VALID_STAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid stage '{body.new_stage}'. Must be one of: {VALID_STAGES}",
        )

    current_idx = VALID_STAGES.index(project.current_stage) if project.current_stage in VALID_STAGES else 0
    new_idx = VALID_STAGES.index(body.new_stage)

    if new_idx <= current_idx:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot move from '{project.current_stage}' backwards to '{body.new_stage}'",
        )

    previous_stage = project.current_stage

    # Record transition in history
    history = list(project.stage_history) if project.stage_history else []
    history.append({
        "stage": previous_stage,
        "completed_at": str(project.updated_at),
        "new_stage": body.new_stage,
        "officer": body.officer,
        "notes": body.notes,
    })

    project.current_stage = body.new_stage
    project.stage_history = history
    db.commit()
    db.refresh(project)

    return StageUpdateResponse(
        project_id=project.id,
        project_code=project.project_code,
        previous_stage=previous_stage,
        new_stage=body.new_stage,
        updated_at=project.updated_at,
        stage_history=history,
    )
