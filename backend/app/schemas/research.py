from pydantic import BaseModel, Field


class RagCitation(BaseModel):
    id: str
    title: str
    authors: str
    year: int
    source: str
    url: str
    snippet: str
    doc_type: str
    relevance_score: float


class RagSearchRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="Natural language policy research query",
        examples=["Impact of land pooling on peri-urban development in India"],
    )
    top_k: int = Field(default=5, ge=1, le=20, description="Number of citations to return")


class RagSearchResponse(BaseModel):
    query: str
    summary: str
    citations: list[RagCitation]
    confidence: float
    response_time_ms: int
    documents_searched: int
