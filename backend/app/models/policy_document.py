import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PolicyDocument(Base):
    """Policy document with vector embedding metadata, tags & citation graph."""

    __tablename__ = "policy_documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # ── Identity ──
    title: Mapped[str] = mapped_column(String(1024), nullable=False)
    authors: Mapped[str] = mapped_column(String(1024), nullable=False, default="")
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    doc_type: Mapped[str] = mapped_column(String(64), nullable=False)
    # Types: case_study | legal_judgment | gazette | policy_paper | research_article | hackathon_brief

    source: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    url: Mapped[str] = mapped_column(String(2048), nullable=False, default="#")
    abstract: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # ── Classification ──
    theme: Mapped[str] = mapped_column(String(64), nullable=False)
    state: Mapped[str] = mapped_column(String(128), nullable=False, default="National")
    tags: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # ["land-pooling", "compensation", "tribal-rights"]

    # ── Vector embedding metadata ──
    embedding_model: Mapped[str] = mapped_column(String(64), nullable=False, default="text-embedding-3-small")
    embedding_dimensions: Mapped[int] = mapped_column(Integer, nullable=False, default=1536)
    embedding_status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")
    # Status: pending | indexed | failed
    chunk_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    vector_store_id: Mapped[str | None] = mapped_column(String(256), nullable=True)

    # ── Citation graph ──
    citation_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cited_by: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # ["doc-uuid-1", "doc-uuid-2"]
    references: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    # [{"title": "...", "authors": "...", "year": 2023}]

    # ── Usage stats ──
    download_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    search_hit_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    relevance_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
