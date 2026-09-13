# VISTARA — Short Report

## Problem Statement (SIH26019)

**Title:** National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance

**Issued by:** Ministry of Rural Development, Department of Land Resources (DoLR)

---

### What is the problem?

India manages land records for 1.4 billion people across 28 states and 8 union territories. But the system is broken in many ways:

1. **Scattered knowledge** — Research papers, policy documents, and datasets are spread across 200+ government departments, universities, and agencies. There is no single place to find them.

2. **No way to test policies before implementing** — When the government wants to change land laws, they have no tool to simulate what will happen. Policies are implemented blindly and then rolled back if they fail, wasting time and money.

3. **No real-time tracking of land acquisition** — Under the RFCTLARR Act 2013, land acquisition moves through 5 legal stages. But nobody has a dashboard to see which projects are stuck, which families haven't been compensated, or where delays are happening.

4. **Paper-based land records** — Old land records like Khasra, Khatauni, and Jamabandi exist only as scanned PDFs. There is no way to search, analyse, or extract data from them automatically.

5. **Delays discovered too late** — By the time a land acquisition project is found to be delayed, crores of rupees have already been lost. There is no early warning system.

6. **Disconnected spatial data** — Satellite images, cadastral maps, and ground-truth photos exist in separate systems. Nobody can overlay them to get a complete picture.

---

### What did the problem statement ask for?

The problem statement asked teams to build a **secure, scalable, AI-enabled National Research and Policy Innovation Platform** that provides:

| # | Requirement |
|---|---|
| 1 | Centralised digital repository for land governance research, policy papers, datasets, legal documents, and case studies |
| 2 | AI-powered search and recommendation engine for discovering relevant research and policy resources |
| 3 | Collaborative workspaces for researchers, policymakers, academic institutions, and government agencies |
| 4 | Interactive GIS-based visualisation of land use patterns, climate vulnerability, infrastructure development, and policy impacts |
| 5 | Advanced analytics and decision-support tools for evaluating policy effectiveness and identifying emerging trends |
| 6 | Policy simulation modules to assess the likely outcomes of proposed reforms before implementation |
| 7 | Integration of satellite imagery, remote sensing, land records, socio-economic datasets, and geospatial databases |
| 8 | AI-assisted research tools for trend analysis, literature synthesis, predictive modelling, and scenario analysis |
| 9 | Innovation portal supporting hackathons, research grants, pilot projects, and knowledge competitions |
| 10 | Interactive dashboards displaying research outputs, policy performance indicators, land use trends, climate resilience metrics, and geospatial insights |
| 11 | Secure role-based access for researchers, government officials, institutions, and public users |
| 12 | APIs for seamless integration with existing government platforms, research databases, and GIS systems |

---

## What is VISTARA?

**VISTARA** stands for **Visionary Integrated System for Transparent Acquisition, Research & Administration**.

It is a full-stack web application that connects six major functions of land governance into one platform:

```
Policy Research → Land Acquisition → Record Digitisation → Risk Prediction → Spatial Analysis → Dashboards
```

Instead of having separate tools for each job, VISTARA puts everything under one roof with a single login, unified role system, and shared data layer.

---

## What does VISTARA do?

VISTARA has **6 modules**, each solving a specific part of the problem:

### Module 1: Policy Hub (`/policy-hub`)

**What it does:** A research and policy knowledge centre.

- **RAG Search** — Type a question like "What is the impact of land pooling on peri-urban development?" and the system searches across 12,400+ indexed documents (academic papers, government gazettes, legal judgments) and gives you an AI-synthesised summary with inline citations.
- **Research Repository** — Browse and filter 50+ policy documents by type, year, state, and topic.
- **Policy Simulator** — Use sliders to adjust compensation multipliers, timeline compression, and consent thresholds. The system shows you in real-time what the impact would be on displacement, cost, and completion time.
- **Innovation Portal** — A section listing hackathons, research grants, pilot projects, and competitions related to land governance.

### Module 2: Land Acquisition Tracker (`/acquisition`)

**What it does:** Tracks every land acquisition project from start to finish.

- **Pipeline View** — A kanban board showing projects moving through 5 legal stages: Proposal → Section 11 Notification → Section 16 R&R Scrutiny → Section 23 Award → Possession.
- **Project Detail** — Click any project to see audit checks, family counts, compensation budgets, and status.
- **Disbursement Ledger** — See which families have been compensated, which are pending, and which have disputes.
- **Stage Advancement** — One-click to move a project to the next stage, with an automatic audit trail.

### Module 3: AI Land Record Digitizer (`/digitizer`)

**What it does:** Converts scanned paper land records into structured digital data.

- **Document Upload** — Upload a scanned Khasra, Khatauni, or Jamabandi PDF.
- **OCR Pipeline** — A 5-step extraction process: Ingestion → Deskew → EasyOCR (reads Hindi + English) → PaddleOCR (field segmentation) → Confidence scoring.
- **Extraction Form** — Shows each extracted field (Khasra number, owner name, area, village, etc.) with a confidence score. Researchers can verify and correct fields.
- **Registry Export** — Verified records are committed to the national parcel database.

### Module 4: Predictive Delay Analytics (`/predictive-analytics`)

**What it does:** Predicts which acquisition projects will be delayed and why.

- **Risk Scoring** — Each project gets a delay probability score based on ML analysis.
- **Explainability Panel** — Shows which factors are driving the risk — legal delays, financial issues, bureaucratic bottlenecks, environmental concerns, social opposition, or technical problems.
- **Parameter Simulator** — Sliders to model what happens if you fix specific risk factors. Shows estimated days saved.
- **Mitigation Recommendations** — Priority-ranked action items with owner assignment.

### Module 5: Watershed Intelligence Lab (`/watershed`)

**What it does:** Geospatial analysis combining satellite data, cadastral maps, and ground-truth photos.

- **GIS Canvas** — Interactive map with 6 togglable layers: satellite imagery, cadastral boundaries, vegetation (NDVI), drainage networks, soil moisture, and climate vulnerability.
- **Geo-Coded Field Photos** — Upload GPS-tagged photos. The system shows them side-by-side with satellite tiles and runs AI spatial analysis.
- **Time-Series Panel** — Multi-year environmental metrics showing how NDVI, soil moisture, and water bodies have changed over 2022–2026.
- **AI Geospatial Analysis** — Backend analysis of land degradation, water structures, vegetation index, and soil erosion risk.

### Module 6: Dashboard (`/dashboard`)

**What it does:** A command centre showing the big picture.

- **Metric Cards** — Total projects, total families affected, total budget, digitisation progress.
- **GIS Canvas** — Mini map showing project locations.
- **Activity Feed** — Real-time log of actions across the platform.
- **Digitisation Queue** — Which records are pending digitisation.

---

## How does VISTARA work?

### Technology Stack

| Layer | What we used | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Fast, modern, type-safe React framework |
| Backend | Python FastAPI, SQLAlchemy, Pydantic | High-performance Python API framework |
| Database | PostgreSQL + PostGIS | Best open-source database with spatial support |
| AI/ML | scikit-learn, sentence-transformers, EasyOCR | Proven libraries for prediction, embeddings, and OCR |
| State | Zustand | Lightweight React state management |
| Animations | Framer Motion | Smooth, performant UI transitions |

### How the pieces connect

```
User opens VISTARA
        │
        ▼
  Frontend (Next.js) loads
        │
        ├──► Tries to reach Backend (FastAPI at localhost:8000)
        │         │
        │    ┌────┴────┐
        │    │         │
        │  Online    Offline
        │    │         │
        │    ▼         ▼
        │  Live API   Mock Data
        │    │         │
        │    └────┬────┘
        │         │
        ▼         ▼
  User sees results (green "Live API" or amber "Cached" badge)
```

This means VISTARA works perfectly even without a running backend (for demos), but lights up fully when connected.

### Role-Based Access

| Role | Level | What they can do |
|---|---|---|
| Citizen | L1 | View dashboards, track public projects |
| Researcher | L2 | Access policy hub, run searches, verify records, run simulations |
| Official | L3 | Manage projects, advance stages, export records |
| Admin | L4 | Full access to everything |

---

## Summary

| What | Details |
|---|---|
| **Problem** | India's land governance is fragmented, paper-heavy, and reactive. No unified platform for research, policy testing, acquisition tracking, or spatial analysis. |
| **Solution** | VISTARA — a 6-module full-stack platform connecting policy research, land acquisition tracking, record digitisation, delay prediction, and geospatial intelligence. |
| **Tech** | Next.js 14 + FastAPI + PostgreSQL/PostGIS + AI/ML services |
| **Status** | 13 pages, 45+ components, 9 API endpoints, 5 database models, zero build errors |
| **Alignment** | Covers all 12 requirements from the problem statement, plus 2 additional modules beyond scope |

---

*Built for Smart India Hackathon 2026 — Problem Statement SIH26019*
