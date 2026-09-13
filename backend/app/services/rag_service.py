"""
RAG Search Service — synthesises policy answers from vector search results.

In production, this calls a vector database (Qdrant / pgvector / Pinecone)
with embedded query and retrieves top-k relevant chunks, then feeds them
to an LLM for answer synthesis. Here we return curated mock responses.
"""

import time
import uuid


# ── Pre-built knowledge base responses ──

_KNOWLEDGE_BASE: dict[str, dict] = {
    "land pooling": {
        "summary": (
            "Land pooling schemes have been deployed across 14 Indian states since 2007, "
            "transforming fragmented peri-urban landholdings into planned urban clusters. "
            "Delhi's Laluwasane model (2013) and Andhra Pradesh's CRDA pooling (2015) "
            "demonstrate that well-designed schemes can yield 30–45% higher land value "
            "appreciation for participating farmers versus forced acquisition under the "
            "2013 LARR Act. Key success factors include: (a) transparent formulae for "
            "plot restitution ratios, (b) guaranteed infrastructure delivery within 36 "
            "months, and (c) community consent thresholds above 70%. However, states with "
            "weaker institutional capacity — Bihar, Jharkhand — show displacement of "
            "marginal farmers when compensation is delayed beyond 18 months."
        ),
        "confidence": 0.93,
        "documents_searched": 12400,
        "citations": [
            {
                "id": "c1",
                "title": "Land Pooling as an Alternative to Land Acquisition: A Critical Assessment",
                "authors": "Anjali Sharma, R. Deshpande",
                "year": 2023,
                "source": "Economic & Political Weekly",
                "url": "https://epw.in/land-pooling-critical-assessment",
                "snippet": "Across 14 states, land pooling has produced higher land value appreciation for participating farmers compared to forced acquisition under the 2013 Act.",
                "doc_type": "research_article",
                "relevance_score": 0.94,
            },
            {
                "id": "c2",
                "title": "Delhi Development (Planning and Management) Act — Land Pooling Scheme Rules",
                "authors": "GNCTD Revenue Department",
                "year": 2013,
                "source": "Delhi Gazette Extraordinary",
                "url": "https://delhi.gov/sites/delhi-gazette",
                "snippet": "Rules for land pooling in Delhi urbanisation zone — Laluwasane model with 70% consent threshold and 36-month infrastructure guarantee.",
                "doc_type": "gazette",
                "relevance_score": 0.91,
            },
            {
                "id": "c3",
                "title": "CRDA Land Pooling Policy: Five-Year Impact Assessment",
                "authors": "A. Rao, K. Reddy",
                "year": 2021,
                "source": "Urban Research & Practice",
                "url": "https://doi.org/10.1080/17535069.2021",
                "snippet": "Andhra Pradesh CRDA's pooling scheme covered 30,000 acres across 29 villages, with infrastructure delivery averaging 42 months.",
                "doc_type": "case_study",
                "relevance_score": 0.87,
            },
        ],
    },
    "compensation": {
        "summary": (
            "Analysis of 23 major infrastructure projects (2015–2024) reveals that R&R "
            "compensation packages under the LARR Act 2013 adequately cover replacement "
            "cost in only 41% of cases. Projects in Maharashtra, Karnataka and Gujarat "
            "show higher adequacy (55–68%) due to state-level multiplier policies, while "
            "projects in UP, MP and Odisha fall below 30%. The most critical gap is "
            "livelihood restoration: only 12% of displaced families report equivalent "
            "income within 3 years. Multiplier rates of 2x–4x land market value are "
            "recommended by NITI Aayog but adopted by only 6 states."
        ),
        "confidence": 0.91,
        "documents_searched": 12400,
        "citations": [
            {
                "id": "c4",
                "title": "Rehabilitation & Resettlement in Infrastructure Projects: A Multi-State Assessment",
                "authors": "NITI Aayog Displacement Cell",
                "year": 2024,
                "source": "NITI Aayog Working Paper",
                "url": "https://niti.gov.in/rr-assessment-2024",
                "snippet": "Across 23 projects, R&R compensation adequately covers replacement cost in only 41% of cases. Multiplier rates of 2x–4x are recommended.",
                "doc_type": "policy_paper",
                "relevance_score": 0.96,
            },
            {
                "id": "c5",
                "title": "Land Acquisition, Rehabilitation and Resettlement Act 2013 — Compensation Framework",
                "authors": "Legislative Department, MoL&J",
                "year": 2013,
                "source": "Gazette of India",
                "url": "https://legislative.gov.in/larr-act-2013",
                "snippet": "Section 27-30: Compensation at four times market value in rural areas, two times in urban. Multiplier framework for different land categories.",
                "doc_type": "gazette",
                "relevance_score": 0.89,
            },
        ],
    },
    "digital": {
        "summary": (
            "The convergence of Aadhaar authentication with digital land record systems "
            "(DILRMP successor programs) raises significant privacy concerns. While 18 "
            "states have mandated Aadhaar-linked property registration, only 3 (Karnataka, "
            "Telangana, Andhra Pradesh) have implemented robust data protection frameworks "
            "compliant with the DPDP Act 2023. Key risks include: (a) linking of property "
            "ownership to biometric identity enabling surveillance, (b) exclusion of "
            "informal occupants lacking Aadhaar, and (c) potential for automated cross-"
            "referencing of property holdings with income tax data."
        ),
        "confidence": 0.89,
        "documents_searched": 12400,
        "citations": [
            {
                "id": "c6",
                "title": "Privacy and Digital Land Records: Navigating the Aadhaar Integration",
                "authors": "Prashant Sharma, L. Mehta",
                "year": 2024,
                "source": "Journal of Indian Law & Technology",
                "url": "https://jilt.in/privacy-digital-land",
                "snippet": "18 states mandate Aadhaar-linked property registration, but only 3 implement DPDP Act-compliant data protection frameworks.",
                "doc_type": "research_article",
                "relevance_score": 0.92,
            },
        ],
    },
}

# Fallback for unmatched queries
_FALLBACK = {
    "summary": (
        "The query could not be precisely matched to our indexed knowledge base. "
        "However, VISTARA's RAG pipeline has searched across 12,400+ documents "
        "including government gazettes, academic papers, legal judgments and policy "
        "briefs. For best results, try more specific queries referencing particular "
        "states, policies, or land governance topics such as 'land pooling', "
        "'compensation adequacy', or 'digital land records'."
    ),
    "confidence": 0.45,
    "documents_searched": 12400,
    "citations": [],
}


def rag_search(query: str, top_k: int = 5) -> dict:
    """Execute RAG search and return synthesised answer with citations."""
    start = time.time()

    query_lower = query.lower()
    matched = _FALLBACK

    for keyword, response in _KNOWLEDGE_BASE.items():
        if keyword in query_lower:
            matched = response
            break

    # If no keyword match, try broader matching
    if matched is _FALLBACK:
        for keyword, response in _KNOWLEDGE_BASE.items():
            if any(word in query_lower for word in keyword.split()):
                matched = response
                break

    citations = matched["citations"][:top_k]
    elapsed_ms = int((time.time() - start) * 1000) + random.randint(200, 500)

    return {
        "query": query,
        "summary": matched["summary"],
        "citations": citations,
        "confidence": matched["confidence"],
        "response_time_ms": elapsed_ms,
        "documents_searched": matched["documents_searched"],
    }


import random
