"""Research API — RAG-powered policy knowledge search."""

from fastapi import APIRouter

from app.schemas.research import RagSearchRequest, RagSearchResponse
from app.services.rag_service import rag_search

router = APIRouter()


@router.post(
    "/rag-search",
    response_model=RagSearchResponse,
    summary="Semantic RAG search across policy knowledge base",
)
def search_rag(body: RagSearchRequest):
    """
    Accepts a natural language policy research query and returns a
    synthesised AI answer with inline academic citations.

    Searches across 12,400+ indexed documents including:
    - Government gazettes and policy papers
    - Legal judgments and case law
    - Academic research articles
    - Hackathon briefs and innovation proposals

    Each citation includes relevance score and direct download link.
    """
    result = rag_search(query=body.query, top_k=body.top_k)
    return RagSearchResponse(**result)
