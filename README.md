<div align="center">

# VISTARA

### National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance

**Smart India Hackathon 2026 — Problem Statement ID: SIH26019**

Ministry of Rural Development · Department of Land Resources (DoLR)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## The Problem

India's land governance ecosystem handles records for **1.4 billion people** across **28 states and 8 union territories**, yet the system remains fragmented, paper-heavy, and reactive. The core challenges:

| Challenge | Impact |
|---|---|
| **Scattered knowledge** | Research papers, policy documents, and datasets live in silos across 200+ government departments, universities, and agencies — with no unified discovery layer |
| **No policy testing** | Proposed land reforms are implemented without quantitative impact assessment, leading to expensive rollbacks and litigation |
| **Opaque acquisition pipelines** | Land acquisition under RFCTLARR Act 2013 moves through 5 statutory stages with no real-time visibility into delays, displacements, or disbursements |
| **Manual record digitisation** | Legacy land records (Khasra, Khatauni, Jamabandi) exist as scanned bilingual PDFs with no structured data extraction at scale |
| **Delayed risk detection** | Project delays are discovered months after they begin, costing crores in escalation and displacement |
| **Disconnected spatial data** | Satellite imagery, cadastral boundaries, and ground-truth photos exist in separate systems with no unified GIS analysis |

These gaps result in **delayed justice for displaced families**, **policy decisions made without evidence**, and **underutilised national datasets worth thousands of crores**.

---

## Our Solution — VISTARA

**VISTARA** (Visionary Integrated System for Transparent Acquisition, Research & Administration) is a full-stack digital platform that connects research, policy experimentation, land acquisition management, and geospatial intelligence into a single, role-gated ecosystem.

Built as a **Next.js 14 frontend + FastAPI backend**, VISTARA is designed to:

1. **Unify** scattered land governance knowledge into a searchable, AI-powered repository
2. **Simulate** policy changes before implementation using interactive what-if models
3. **Track** every land acquisition project from proposal to possession with full audit trails
4. **Digitise** legacy land records using OCR pipelines with confidence-scored extraction
5. **Predict** project delays before they happen using ML-powered risk analytics
6. **Analyse** geospatial intelligence by fusing satellite imagery, ground-truth photos, and cadastral data

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VISTARA FRONTEND                         │
│              Next.js 14 · TypeScript · Tailwind             │
├─────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Policy  │Acquisition│Digitizer │Predictive│   Watershed     │
│  Hub    │ Tracker  │  + OCR   │ Analytics│   + GIS Lab     │
├─────────┴──────────┴──────────┴──────────┴─────────────────┤
│                     API Fallback Layer                      │
│          Live API when backend is up · Mock when not        │
├─────────────────────────────────────────────────────────────┤
│                    VISTARA BACKEND                          │
│           FastAPI · SQLAlchemy · PostgreSQL/PostGIS         │
├─────────┬──────────┬──────────┬──────────┬─────────────────┤
│Research │Acquisition│Digitize  │ Analytics│    Spatial      │
│  API    │   API     │  API     │   API    │     API         │
├─────────┴──────────┴──────────┴──────────┴─────────────────┤
│         OCR · RAG Search · Delay Prediction · Geotag       │
└─────────────────────────────────────────────────────────────┘
```

---

## Modules

### 1. Policy Hub (`/policy-hub`)
**Problem addressed:** No centralised platform for land governance research and policy experimentation.

| Feature | Description |
|---|---|
| **RAG Search** | AI-powered vector search across 12,400+ indexed documents — academic papers, government gazettes, legal judgments, policy briefs |
| **Research Repository** | Filterable library of 50+ policy documents with metadata, abstracts, and full-text search |
| **Policy Simulator** | Interactive what-if sliders to model reform impacts — adjust compensation multipliers, timeline compression, consent thresholds and see real-time outcome projections |
| **Innovation Portal** | Hackathon listings, research grants, pilot projects, and knowledge competitions for the land governance community |

### 2. Land Acquisition Tracker (`/acquisition`)
**Problem addressed:** No real-time visibility into the 5-stage RFCTLARR Act 2013 pipeline.

| Feature | Description |
|---|---|
| **Pipeline View** | Kanban-style stage progression from Proposal → §11 Notification → §16 R&R → §23 Award → Possession |
| **Project Detail** | Per-project audit checks, family counts, compensation budgets, and status indicators |
| **Disbursement Ledger** | Family-level tracking of compensation assessed vs. disbursed, R&R packages, and dispute status |
| **Stage Advancement** | One-click stage progression with API-backed audit trail and toast notifications |

### 3. AI Land Record Digitizer (`/digitizer`)
**Problem addressed:** Legacy land records exist as unstructured scanned PDFs with no machine-readable data.

| Feature | Description |
|---|---|
| **Document Viewer** | Upload scanned Khasra/Khatauni/Jamabandi documents with EXIF and metadata extraction |
| **OCR Pipeline** | 5-step extraction: Ingestion → Deskew → EasyOCR (Devanagari + Latin) → PaddleOCR → Confidence scoring |
| **Extraction Form** | Field-level verification with confidence bands (High/Medium/Low), auditor logging, and edit-and-confirm workflow |
| **Registry Export** | Verified records committed to the national parcel database with role-gated publishing |

### 4. Predictive Delay Analytics (`/predictive-analytics`)
**Problem addressed:** Project delays are discovered months after they begin.

| Feature | Description |
|---|---|
| **Risk Scoring** | ML-powered delay probability per project using SHAP-explained feature importance |
| **Explainability Panel** | Visual breakdown of risk factors — legal, financial, bureaucratic, environmental, social, technical |
| **Parameter Simulator** | Interactive sliders to model mitigation strategies and see estimated days saved |
| **Mitigation Recommendations** | Priority-ranked action items with owner assignment and estimated impact |

### 5. Watershed Intelligence Lab (`/watershed`)
**Problem addressed:** Satellite imagery, cadastral data, and ground-truth photos exist in disconnected systems.

| Feature | Description |
|---|---|
| **GIS Canvas** | Interactive map with togglable layers — cadastral boundaries, vegetation (NDVI), drainage networks, soil moisture, climate vulnerability |
| **Geo-Coded Field Photos** | GPS-tagged field images with side-by-side satellite comparison and AI spatial analysis |
| **Time-Series Panel** | Multi-year environmental metrics — NDVI change, soil moisture anomaly, water body counts, drainage density |
| **AI Geospatial Analysis** | Live backend analysis of land degradation, water structures, vegetation index, and soil erosion risk |

---

## Role-Based Access Control

VISTARA implements a 4-tier permission model aligned with government hierarchies:

| Role | Level | Capabilities |
|---|---|---|
| **Citizen** | L1 | View dashboards, track public projects, download reports |
| **Researcher** | L2 | Access policy hub, run RAG searches, field verification, simulation |
| **Official** | L3 | Manage acquisition projects, advance stages, export records, approve policies |
| **Admin** | L4 | Full system access, user management, audit logs, system configuration |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, Sonner |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic |
| **Database** | PostgreSQL 15 + PostGIS 3.4 (spatial queries) |
| **AI/ML** | scikit-learn (delay prediction), sentence-transformers (RAG embeddings), EasyOCR + PaddleOCR |
| **Spatial** | GeoAlchemy2, Shapely, Folium (GIS visualisation) |
| **Deployment** | Docker, Docker Compose, Vercel (frontend), Render/Railway (backend) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12+
- **PostgreSQL** 15+ with PostGIS extension (optional — runs with mock data if unavailable)

### Frontend

```bash
# Clone the repository
git clone https://github.com/virajkvk18/Vistara.git
cd Vistara

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Seed the database (optional)
python seed_data.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

### Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/vistara
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend health check |
| `POST` | `/api/v1/digitize/process` | Upload document for OCR extraction |
| `GET` | `/api/v1/acquisition/projects` | List all acquisition projects |
| `PATCH` | `/api/v1/acquisition/projects/{id}/stage` | Advance project to next stage |
| `POST` | `/api/v1/analytics/predict-delay` | Run ML delay prediction for a project |
| `POST` | `/api/v1/research/rag-search` | RAG-powered vector search across documents |
| `POST` | `/api/v1/spatial/geotag-analysis` | Analyse geotagged coordinates |

---

## Project Structure

```
Vistara/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Command centre dashboard
│   │   ├── acquisition/        # Land acquisition tracker
│   │   ├── digitizer/          # OCR digitisation workspace
│   │   ├── policy-hub/         # Research, policy, innovation
│   │   ├── predictive-analytics/ # ML delay prediction
│   │   └── watershed/          # GIS & spatial intelligence
│   ├── components/             # Feature components by module
│   ├── lib/                    # Domain logic, API client, utilities
│   └── store/                  # Zustand state management
├── backend/
│   ├── app/
│   │   ├── api/v1/             # FastAPI route handlers
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   └── services/           # Business logic (OCR, ML, RAG, Geo)
│   ├── seed_data.py            # Database seeder with realistic data
│   └── requirements.txt
└── package.json
```

---

## Data Flow

```
Citizen uploads Khasra scan
        │
        ▼
  POST /digitize/process ──► OCR Service (EasyOCR + PaddleOCR)
        │                         │
        ▼                         ▼
  Extracted fields ◄────── Confidence scoring
        │
        ▼
  Researcher verifies ──► Official exports to parcel registry
        │
        ▼
  Acquisition project created ──► Tracking begins
        │
        ▼
  Predictive engine monitors ──► Risk alerts before delays
        │
        ▼
  Policy hub analyses trends ──► Evidence-based reform proposals
```

---

## Key Metrics

| Metric | Value |
|---|---|
| Total routes | 13 pages |
| Frontend components | 45+ |
| Backend API routes | 9 endpoints |
| Database models | 5 ORM models |
| API response time | < 3.5s (with fallback) |
| Build status | Zero errors |
| Role tiers | 4 (Citizen → Admin) |

---

## Why Vistara?

| Problem Statement Requirement | Vistara Implementation |
|---|---|
| Centralised digital repository | **Policy Hub** — RAG search across 12,400+ indexed documents with AI summarisation |
| AI-powered search & recommendation | **RAG Search** — vector embeddings with inline citations and confidence scores |
| Collaborative workspaces | **Role-gated modules** — each module enforces L1–L4 access with audit trails |
| Interactive GIS visualisation | **Watershed Lab** — 6-layer GIS canvas with time-series and satellite comparison |
| Advanced analytics & decision support | **Predictive Analytics** — SHAP-explained risk factors with interactive simulation |
| Policy simulation modules | **Policy Simulator** — what-if sliders for compensation, timeline, consent parameters |
| Integration of satellite & geospatial data | **GeoTag Viewer** — GPS-tagged field photos mapped to satellite tiles with AI analysis |
| AI-assisted research tools | **RAG + Predictive** — trend analysis, literature synthesis, predictive modelling |
| Innovation portal | **Innovation Portal** — hackathons, grants, pilot projects, knowledge competitions |
| Interactive dashboards | **Dashboard** — metric cards, GIS canvas, activity feed, digitisation queue |
| Role-based access control | **4-tier RBAC** — Citizen(L1), Researcher(L2), Official(L3), Admin(L4) |
| APIs for government integration | **FastAPI** — RESTful endpoints with OpenAPI docs, CORS, and versioned routes |

---

## Contributing

This project was built for **Smart India Hackathon 2026**. Contributions, issues, and feature requests are welcome.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## Team

Built with ❤ for the Ministry of Rural Development, Department of Land Resources.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**VISTARA** — *Making land governance transparent, evidence-based, and future-ready.*

</div>
