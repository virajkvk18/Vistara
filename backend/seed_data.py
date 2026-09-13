"""
VISTARA Database Seeder — realistic Indian land governance data.

Usage:
    cd backend
    python seed_data.py

Requires: pip install faker shapely sqlalchemy psycopg2-binary
Requires: PostgreSQL with PostGIS running and an empty vistara_db database.

What it seeds:
    1. 10 Land Acquisition Projects (multi-state, multi-stage)
    2. 20 Digitized Land Records (Khasra/Khata, mixed confidence)
    3. 10 Delay Predictions with SHAP features (high-risk flags)
    4. 5 Policy Documents & Case Studies for RAG
"""

import json
import random
import sys
import uuid
from datetime import datetime, timedelta
from pathlib import Path

from faker import Faker
from shapely.geometry import Point, Polygon, mapping

# ── Ensure backend app is importable ──
sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models import (
    AcquisitionProject,
    DigitizedRecord,
    DelayPrediction,
    PolicyDocument,
)

fake = Faker("en_IN")
Faker.seed(42)
random.seed(42)

# ══════════════════════════════════════════════════════════════════════════════
# REFERENCE DATA
# ══════════════════════════════════════════════════════════════════════════════

INDIAN_STATES_DISTRICTS = {
    "Madhya Pradesh": {
        "districts": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
        "center": (22.97, 78.66),
        "tehsils": ["Mhow", "Harsewnga", "Pithampur", "Sanwer", "Depalpur"],
    },
    "Uttar Pradesh": {
        "districts": ["Lucknow", "Noida", "Agra", "Varanasi", "Meerut"],
        "center": (26.85, 80.91),
        "tehsils": ["Sarojini Nagar", "Gomti Nagar", "Achnera", "Sadar", "Barsana"],
    },
    "Maharashtra": {
        "districts": ["Pune", "Mumbai Suburban", "Nagpur", "Thane", "Nashik"],
        "center": (19.75, 75.71),
        "tehsils": ["Haveli", "Baramati", "Mulshi", "Maval", "Indapur"],
    },
    "Gujarat": {
        "districts": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
        "center": (22.26, 71.19),
        "tehsils": ["Daskroi", "Dholka", "Viramgam", "Sanand", "Mandal"],
    },
    "Karnataka": {
        "districts": ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubli-Dharwad", "Belagavi"],
        "center": (15.32, 76.41),
        "tehsils": ["Bangalore North", "Bangalore South", "Kolar", "Tumkur", "Ramanagara"],
    },
    "Andhra Pradesh": {
        "districts": ["Guntur", "Krishna", "Visakhapatnam", "Chittoor", "East Godavari"],
        "center": (15.91, 79.74),
        "tehsils": ["Guntur", "Tenali", "Mangalagiri", "Tadikonda", "Phirangipuram"],
    },
    "Rajasthan": {
        "districts": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
        "center": (27.02, 74.22),
        "tehsils": ["Sanganer", "Shahpura", "Chomu", "Jamwa Ramgarh", "Kotputli"],
    },
    "Odisha": {
        "districts": ["Khordha", "Cuttack", "Ganjam", "Sambalpur", "Balangir"],
        "center": (20.95, 85.10),
        "tehsils": ["Jatni", "Tangi", "Banpur", "Begunia", "Athagarh"],
    },
    "Tamil Nadu": {
        "districts": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
        "center": (11.13, 78.66),
        "tehsils": ["Tambaram", "Avadi", "Sriperumbudur", "Gummidipoondi", "Ponneri"],
    },
    "Telangana": {
        "districts": ["Hyderabad", "Rangareddy", "Medchal", "Warangal", "Karimnagar"],
        "center": (17.12, 79.20),
        "tehsils": ["Hayathnagar", "Malkajgiri", "Kapra", "Uppal", "LB Nagar"],
    },
}

STAGES = ["proposal", "section11", "section19", "section24", "section41", "possession"]

LAND_TYPES = ["Agricultural", "Residential", "Commercial", "Industrial", "Forest", "Wasteland"]

FIRST_NAMES_MALE = [
    "Ramesh", "Suresh", "Mahesh", "Rajesh", "Dinesh", "Mukesh", "Ganesh",
    "Prakash", "Deepak", "Ajay", "Vijay", "Sanjay", "Ram", "Shyam", "Krishna",
    "Arun", "Vinod", "Ashok", "Sunil", "Manoj", "Pawan", "Tarun", "Vikram",
    "Sanjeev", "Ravi", "Naveen", "Ashish", "Rohit", "Amit", "Sumit",
]

FIRST_NAMES_FEMALE = [
    "Sunita", "Sunita", "Rekha", "Neha", "Pooja", "Asha", "Geeta",
    "Saroj", "Kamla", "Anita", "Meena", "Pushpa", "Savita", "Usha",
    "Vandana", "Nisha", "Kavita", "Priti", "Ritu", "Deepa", "Mamta",
]

LAST_NAMES = [
    "Kumar", "Singh", "Sharma", "Verma", "Gupta", "Yadav", "Pandey",
    "Mishra", "Tiwari", "Chaudhary", "Patel", "Joshi", "Reddy", "Nair",
    "Menon", "Das", "Rao", "Naik", "Prasad", "Mehta", "Thakur", "Chauhan",
]

VILLAGES = [
    "Laluwasane", "Bawana", "Najafgarh", "Mundka", "Kirari", "Begumpur",
    "Sultanpuri", "Mangolpuri", "Nangloi", "Rajouri", "Paschim Vihar",
    "Pithampur", "Sanwer", "Mhow", "Depalpur", "Betma", "Manpur",
    "Hinjewadi", "Mulshi", "Baramati", "Indapur", "Pimpri", "Chinchwad",
    "Daskroi", "Dholka", "Sanand", "Viramgam", "Mandal", "Bavla",
    "Jatni", "Tangi", "Banpur", "Athagarh", "Phulbani", "Daringbadi",
    "Sanganer", "Chomu", "Shahpura", "Kotputli", "Jamwa Ramgarh",
    "Bangalore North", "Ramanagara", "Kolar", "Tumkur", "Hosur",
]

OCR_ENGINES = ["easyocr", "paddleocr", "tesseract"]

MITIGATION_ACTIONS = [
    ("Fast-track Section 19 hearing via District Collector", "critical", 45),
    ("Deploy inter-agency coordination committee", "critical", 38),
    ("Accelerate R&R disbursement through DBT", "high", 30),
    ("Engage community liaison for consent building", "high", 25),
    ("Pre-empt environmental clearance via auto-expedited track", "medium", 20),
    ("Establish dedicated project monitoring cell", "medium", 15),
    ("Initiate parallel land survey and valuation", "high", 22),
    ("Resolve outstanding court stays through AG coordination", "critical", 50),
    ("Deploy GIS-based parcel verification for disputed lands", "medium", 18),
    ("Fast-track forest clearance via MoEFCC regional office", "high", 28),
]

DELAY_DRIVERS = [
    ("Pending Legal Disputes", "Writ petitions filed in High Court challenging acquisition notification"),
    ("Compensation Disbursement Lag", "Delayed release of compensation from state treasury to affected families"),
    ("Environmental Clearance Hold", "MoEFCC public hearing pending due to community objections"),
    ("Consent Threshold Deficit", "Only 58% consent achieved vs 70% mandatory under LARR Act"),
    ("Multi-Department Coordination", "Revenue, Forest & Urban Development departments yet to clear"),
    ("Social Impact Assessment Delay", "SIA committee report pending state government review"),
    ("Revenue Record Discrepancy", "Mismatch between revenue records and ground survey data"),
    ("R&R Package Rejection", "Affected families rejected proposed rehabilitation package"),
    ("Forest Diversion Clearance", "MoEFCC Stage I clearance pending for forest land diversion"),
    ("Boundary Dispute", "Adjacent Gram Panchayats contesting project boundary demarcation"),
]


# ══════════════════════════════════════════════════════════════════════════════
# GEOMETRY HELPERS (Shapely)
# ══════════════════════════════════════════════════════════════════════════════

def make_project_boundary(center_lat: float, center_lng: float, area_ha: float) -> str:
    """Generate a realistic irregular polygon for a project boundary."""
    # Approximate radius in degrees for given area
    # 1 degree lat ~ 111 km, 1 degree lng ~ 111 * cos(lat) km
    import math
    radius_km = math.sqrt(area_ha / 100 * math.pi)  # rough circle
    radius_lat = radius_km / 111.0
    radius_lng = radius_km / (111.0 * math.cos(math.radians(center_lat)))

    # Generate irregular polygon with 8-12 vertices
    n_vertices = random.randint(8, 12)
    angles = sorted(random.uniform(0, 360) for _ in range(n_vertices))
    coords = []
    for angle in angles:
        r_lat = radius_lat * random.uniform(0.6, 1.3)
        r_lng = radius_lng * random.uniform(0.6, 1.3)
        rad = math.radians(angle)
        lat = center_lat + r_lat * math.sin(rad)
        lng = center_lng + r_lng * math.cos(rad)
        coords.append((round(lng, 6), round(lat, 6)))

    # Close the polygon
    coords.append(coords[0])
    poly = Polygon(coords)
    return poly.wkt


def make_parcel_boundary(center_lat: float, center_lng: float) -> str:
    """Generate a small rectangular parcel boundary."""
    import math
    dlat = random.uniform(0.001, 0.004)
    dlng = random.uniform(0.001, 0.004)
    coords = [
        (center_lng - dlng, center_lat - dlat),
        (center_lng + dlng, center_lat - dlat),
        (center_lng + dlng, center_lat + dlat),
        (center_lng - dlng, center_lat + dlat),
        (center_lng - dlng, center_lat - dlat),
    ]
    return Polygon(coords).wkt


# ══════════════════════════════════════════════════════════════════════════════
# KHASRA / KHATA GENERATOR
# ══════════════════════════════════════════════════════════════════════════════

def gen_khasra() -> str:
    """Generate realistic Khasra number like 402/1, 127/2A, 56/3B."""
    main = random.randint(1, 999)
    sub = random.randint(1, 20)
    suffix = random.choice(["", "", "", "A", "B", "C", "P", "R"])
    return f"{main}/{sub}{suffix}"


def gen_khata() -> str:
    """Generate Khata number like 12, 45/A, 103/B."""
    num = random.randint(1, 500)
    suffix = random.choice(["", "", "", "/A", "/B", "/C"])
    return f"{num}{suffix}"


def gen_survey_number() -> str:
    """Generate Survey/Plot number like 14/2, 7/3A, 22/1."""
    main = random.randint(1, 600)
    sub = random.randint(1, 30)
    suffix = random.choice(["", "", "A", "B"])
    return f"{main}/{sub}{suffix}"


# ══════════════════════════════════════════════════════════════════════════════
# SEED: ACQUISITION PROJECTS
# ══════════════════════════════════════════════════════════════════════════════

PROJECT_TEMPLATES = [
    {
        "code": "NH-44-MP-2024",
        "name": "NH-44 Highway Expansion — Indore to Dewas Section",
        "desc": "Four-laning of NH-44 between Indore and Dewas covering 67 km with 3 interchange points. Affects 14 villages across Indore and Dewas districts.",
        "state": "Madhya Pradesh",
        "ministry": "MoRTH",
        "area_ha": 420.5,
        "budget_cr": 1850.0,
        "families": 845,
        "stage": "section19",
    },
    {
        "code": "DFC-UP-2023",
        "name": "Dedicated Freight Corridor — Partapur to Khurja Section",
        "desc": "Eastern Dedicated Freight Corridor alignment through Partapur-Khurja spanning 142 km. Multi-cargo terminal at Khurja junction.",
        "state": "Uttar Pradesh",
        "ministry": "MoRTH",
        "area_ha": 890.2,
        "budget_cr": 4200.0,
        "families": 2340,
        "stage": "section24",
    },
    {
        "code": "Mumbai-Metro-3-MH",
        "name": "Mumbai Metro Line 3 — Colaba-Bandra-SEEPZ Extension",
        "desc": "Underground metro corridor spanning 33.5 km with 27 stations. Major underground work in Aarey Colony and BKC.",
        "state": "Maharashtra",
        "ministry": "MoHUA",
        "area_ha": 156.8,
        "budget_cr": 3727.0,
        "families": 1230,
        "stage": "section41",
    },
    {
        "code": "DMIC-GJ-2023",
        "name": "DMIC Industrial Township — Dholera SIR Phase II",
        "desc": "Delhi-Mumbai Industrial Corridor special investment region in Dholera. Phase II covering 120 sq km with smart city infrastructure.",
        "state": "Gujarat",
        "ministry": "DPIIT",
        "area_ha": 12000.0,
        "budget_cr": 28500.0,
        "families": 5600,
        "stage": "section11",
    },
    {
        "code": "Narmada-KN-2024",
        "name": "Upper Bhadra Project — Lift Irrigation Channel",
        "desc": "Major lift irrigation canal from Tungabhadra to Upper Bhadra command area spanning 245 km across 4 districts.",
        "state": "Karnataka",
        "ministry": "Jal Shakti",
        "area_ha": 2300.0,
        "budget_cr": 9800.0,
        "families": 3120,
        "stage": "section11",
    },
    {
        "code": "CRDA-AP-2024",
        "name": "Amaravati Capital Region — Land Pooling Zone 4",
        "desc": "Capital city land pooling scheme covering 217 sq km across 29 villages in Guntur and Krishna districts for Andhra Pradesh capital.",
        "state": "Andhra Pradesh",
        "ministry": "MoHUA",
        "area_ha": 21700.0,
        "budget_cr": 52000.0,
        "families": 29000,
        "stage": "possession",
    },
    {
        "code": "RRVNL-RJ-2024",
        "name": "Rajasthan Renewable Energy Zone — Bhadla Solar Park Phase III",
        "desc": "Expansion of Bhadla solar park adding 2,500 MW capacity over 5,000 hectares in Jodhpur district.",
        "state": "Rajasthan",
        "ministry": "MNRE",
        "area_ha": 5000.0,
        "budget_cr": 12500.0,
        "families": 890,
        "stage": "proposal",
    },
    {
        "code": "Steel-OD-2023",
        "name": "Tata Steel — Kalinganagar Expansion Project",
        "desc": "Expansion of Kalinganagar steel plant from 3 MTPA to 8 MTPA with captive port facility. Affects 6 revenue villages.",
        "state": "Odisha",
        "ministry": "MoCI",
        "area_ha": 1850.0,
        "budget_cr": 25000.0,
        "families": 1560,
        "stage": "section24",
    },
    {
        "code": "Chennai-Metro-TN",
        "name": "Chennai Metro Phase II — Maduravoyal to SIPCOT Extension",
        "desc": "Extended metro corridor covering 118.9 km with 128 stations across Chennai metropolitan region.",
        "state": "Tamil Nadu",
        "ministry": "MoHUA",
        "area_ha": 285.0,
        "budget_cr": 63000.0,
        "families": 4200,
        "stage": "section19",
    },
    {
        "code": "MLCP-TS-2024",
        "name": "Hyderabad Multi-Modal Transport — Regional Ring Road South Section",
        "desc": "156 km regional ring road connecting ORR to existing NH network. Passes through 3 ITDA tribal areas.",
        "state": "Telangana",
        "ministry": "MoRTH",
        "area_ha": 920.0,
        "budget_cr": 8400.0,
        "families": 1780,
        "stage": "section11",
    },
]


def seed_acquisition_projects(db) -> list:
    """Create 10 acquisition projects with full lifecycle data."""
    projects = []

    for tmpl in PROJECT_TEMPLATES:
        state_data = INDIAN_STATES_DISTRICTS[tmpl["state"]]
        district = random.choice(state_data["districts"])
        tehsil = random.choice(state_data["tehsils"])
        center_lat = state_data["center"][0] + random.uniform(-0.5, 0.5)
        center_lng = state_data["center"][1] + random.uniform(-0.5, 0.5)

        # Stage history
        current_idx = STAGES.index(tmpl["stage"])
        history = []
        for i in range(current_idx + 1):
            entered = datetime(2023, 1, 1) + timedelta(days=random.randint(0, 600))
            completed = entered + timedelta(days=random.randint(30, 180)) if i < current_idx else None
            history.append({
                "stage": STAGES[i],
                "entered_at": entered.isoformat(),
                "completed_at": completed.isoformat() if completed else None,
                "officer": fake.name(),
                "notes": f"Stage {STAGES[i]} {'completed' if completed else 'in progress'}",
            })

        # Families
        total_families = tmpl["families"]
        r_and_r = int(total_families * random.uniform(0.4, 0.85))
        rehabilitated = int(r_and_r * random.uniform(0.15, 0.70))

        family_details = []
        for fi in range(min(15, total_families)):
            fname = random.choice(FIRST_NAMES_MALE + FIRST_NAMES_FEMALE)
            lname = random.choice(LAST_NAMES)
            family_details.append({
                "family_id": f"FAM-{uuid.uuid4().hex[:8].upper()}",
                "head_name": f"{fname} {lname}",
                "displacement_type": random.choice(["voluntary", "involuntary", "voluntary"]),
                "land_holding_acres": round(random.uniform(0.3, 8.5), 2),
                "compensation_amount": round(random.uniform(2.5, 45.0), 2),
                "r_and_r_status": random.choice(["pending", "in_progress", "completed", "completed"]),
            })

        # Financials
        budget = tmpl["budget_cr"]
        compensation = round(budget * random.uniform(0.15, 0.30), 2)
        infra = round(budget * random.uniform(0.40, 0.65), 2)
        admin = round(budget * random.uniform(0.02, 0.05), 2)
        rehab = round(budget - compensation - infra - admin, 2)

        expenditure = {
            "compensation": compensation,
            "rehabilitation": rehab,
            "infrastructure": infra,
            "administration": admin,
        }

        # Audit checks
        checks = [
            {"check": "social_impact_assessment", "status": random.choice(["passed", "passed", "in_progress"]),
             "date": (datetime(2023, 6, 1) + timedelta(days=random.randint(0, 300))).strftime("%Y-%m-%d"),
             "officer": fake.name()},
            {"check": "environmental_clearance", "status": random.choice(["passed", "in_progress", "pending"]),
             "date": (datetime(2023, 9, 1) + timedelta(days=random.randint(0, 200))).strftime("%Y-%m-%d"),
             "officer": fake.name()},
            {"check": "revenue_survey", "status": "passed",
             "date": (datetime(2023, 3, 1) + timedelta(days=random.randint(0, 150))).strftime("%Y-%m-%d"),
             "officer": fake.name()},
            {"check": "forest_diversion", "status": random.choice(["passed", "pending", "not_applicable"]),
             "date": (datetime(2024, 1, 1) + timedelta(days=random.randint(0, 100))).strftime("%Y-%m-%d"),
             "officer": fake.name()},
        ]

        risk = round(random.uniform(0.1, 0.95), 3)
        delay_prob = round(min(0.98, risk * random.uniform(0.7, 1.3)), 3)

        project = AcquisitionProject(
            id=uuid.uuid4(),
            project_code=tmpl["code"],
            project_name=tmpl["name"],
            description=tmpl["desc"],
            state=tmpl["state"],
            district=district,
            ministry=tmpl["ministry"],
            current_stage=tmpl["stage"],
            stage_history=history,
            total_families=total_families,
            families_r_and_r=r_and_r,
            families_rehabilitated=rehabilitated,
            families_details=family_details,
            project_area_ha=tmpl["area_ha"],
            boundary_wkt=make_project_boundary(center_lat, center_lng, tmpl["area_ha"]),
            parcels_count=random.randint(80, 2500),
            total_budget_cr=budget,
            compensation_paid_cr=round(compensation * random.uniform(0.1, 0.7), 2),
            infrastructure_budget_cr=infra,
            expenditure_breakdown=expenditure,
            audit_checks=checks,
            risk_score=risk,
            delay_probability=delay_prob,
        )
        db.add(project)
        projects.append(project)

    db.commit()
    print(f"  [+] {len(projects)} acquisition projects seeded")
    return projects


# ══════════════════════════════════════════════════════════════════════════════
# SEED: DIGITIZED RECORDS
# ══════════════════════════════════════════════════════════════════════════════

OWNER_NAMES = [
    "Ramesh Kumar", "Suresh Singh", "Mahesh Sharma", "Rajesh Verma", "Dinesh Gupta",
    "Smt. Kamla Devi", "Smt. Rekha Bai", "Smt. Sunita Devi", "Smt. Asha Bai",
    "Sh. Prakash Patel", "Sh. Deepak Reddy", "Sh. Vijay Nair", "Sh. Sanjay Rao",
    "Smt. Geeta Devi", "Smt. Sarojini Nair", "Sh. Ajay Mishra", "Sh. Vikram Chauhan",
    "Smt. Pooja Sharma", "Sh. Krishna Prasad", "Smt. Meena Kumari",
    "Sh. Ram Niwas", "Sh. Hari Singh", "Smt. Savitri Devi", "Sh. Mahendra Patel",
    "Smt. Kavita Devi", "Sh. Ravi Shankar", "Smt. Usha Rani", "Sh. Naresh Kumar",
]


def seed_digitized_records(db) -> list:
    """Create 20 digitized land records with realistic Khasra/Khata data."""
    records = []

    for i in range(20):
        state_name = random.choice(list(INDIAN_STATES_DISTRICTS.keys()))
        state_data = INDIAN_STATES_DISTRICTS[state_name]
        district = random.choice(state_data["districts"])
        tehsil = random.choice(state_data["tehsils"])
        village = random.choice(VILLAGES)

        center_lat = state_data["center"][0] + random.uniform(-0.3, 0.3)
        center_lng = state_data["center"][1] + random.uniform(-0.3, 0.3)

        owner = OWNER_NAMES[i % len(OWNER_NAMES)]
        khasra = gen_khasra()
        khata = gen_khata()
        area = round(random.uniform(0.25, 12.5), 2)
        land_type = random.choice(LAND_TYPES)

        # Mixed confidence — some high, some need review
        if i < 12:
            base_conf = random.uniform(0.78, 0.97)
        elif i < 17:
            base_conf = random.uniform(0.55, 0.79)
        else:
            base_conf = random.uniform(0.35, 0.58)

        confidence = {
            "khasra_number": round(min(1.0, base_conf + random.uniform(-0.05, 0.08)), 2),
            "khata_number": round(min(1.0, base_conf + random.uniform(-0.08, 0.05)), 2),
            "owner_name": round(min(1.0, base_conf + random.uniform(-0.10, 0.06)), 2),
            "area_acres": round(min(1.0, base_conf + random.uniform(-0.12, 0.04)), 2),
            "village": round(min(1.0, base_conf + random.uniform(-0.03, 0.10)), 2),
            "district": round(min(1.0, base_conf + random.uniform(-0.02, 0.12)), 2),
            "state": round(min(1.0, base_conf + random.uniform(-0.01, 0.15)), 2),
            "land_type": round(min(1.0, base_conf + random.uniform(-0.15, 0.08)), 2),
            "date_of_deed": round(min(1.0, base_conf + random.uniform(-0.20, 0.05)), 2),
        }

        overall = round(sum(confidence.values()) / len(confidence), 2)
        needs_review = overall < 0.80

        deed_year = random.randint(2005, 2024)
        deed_month = random.randint(1, 12)
        deed_day = random.randint(1, 28)
        month_name = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"][deed_month - 1]

        raw_text = (
            f"DEED OF SALE — REGISTERED DOCUMENT\n"
            f"Date: {deed_day:02d}-{month_name}-{deed_year}\n"
            f"Vendor: {owner}\n"
            f"Village: {village}, Tehsil: {tehsil}\n"
            f"District: {district}, State: {state_name}\n"
            f"Khasra No: {khasra}, Khata No: {khata}\n"
            f"Area: {area} Acres | Type: {land_type}\n"
            f"Sale Consideration: Rs. {random.randint(5, 200)},{random.randint(10,99)},{random.randint(100,999)}/-"
        )

        file_size = random.randint(850_000, 6_200_000)

        record = DigitizedRecord(
            id=uuid.uuid4(),
            created_at=datetime(2024, random.randint(1, 12), random.randint(1, 28)),
            original_filename=f"scan_{village.lower().replace(' ', '_')}_{khasra.replace('/', '-')}_{i+1:03d}.jpg",
            file_size_bytes=file_size,
            mime_type=random.choice(["image/jpeg", "image/jpeg", "image/png"]),
            ocr_engine=random.choice(OCR_ENGINES),
            raw_text=raw_text,
            extracted_fields={
                "khasra_number": khasra,
                "khata_number": khata,
                "survey_number": gen_survey_number(),
                "owner_name": owner,
                "area_acres": area,
                "village": village,
                "tehsil": tehsil,
                "district": district,
                "state": state_name,
                "land_type": land_type,
                "date_of_deed": f"{deed_year}-{deed_month:02d}-{deed_day:02d}",
            },
            confidence_scores=confidence,
            overall_confidence=overall,
            requires_human_review=needs_review,
            boundary_wkt=make_parcel_boundary(center_lat, center_lng),
            centroid_lat=round(center_lat, 6),
            centroid_lng=round(center_lng, 6),
            processing_time_ms=random.randint(450, 3800),
            status="completed" if not needs_review else "needs_review",
        )
        db.add(record)
        records.append(record)

    db.commit()
    print(f"  [+] {len(records)} digitized records seeded")
    return records


# ══════════════════════════════════════════════════════════════════════════════
# SEED: DELAY PREDICTIONS
# ══════════════════════════════════════════════════════════════════════════════

def seed_delay_predictions(db, projects: list) -> list:
    """Create delay predictions for all projects, with high-risk flags."""
    predictions = []

    for project in projects:
        # Determine risk level — ensure some are >80%
        if project.delay_probability > 0.7:
            prob = round(random.uniform(0.80, 0.98), 3)
            predicted_days = random.randint(500, 1200)
            category = "Critical" if prob > 0.85 else "High"
        elif project.delay_probability > 0.4:
            prob = round(random.uniform(0.45, 0.78), 3)
            predicted_days = random.randint(200, 600)
            category = "High" if prob > 0.6 else "Moderate"
        else:
            prob = round(random.uniform(0.12, 0.44), 3)
            predicted_days = random.randint(60, 250)
            category = "Moderate" if prob > 0.3 else "Low"

        confidence = round(random.uniform(0.75, 0.96), 2)

        # SHAP features — realistic drivers
        shap_features = [
            {"feature": "bureaucratic_delay", "label": "Bureaucratic Bottleneck",
             "impact": round(random.uniform(0.15, 0.42), 3), "direction": "positive",
             "description": "Multi-department coordination delays across revenue, forest & urban development"},
            {"feature": "environmental_clearance", "label": "Environmental Clearance",
             "impact": round(random.uniform(0.08, 0.30), 3), "direction": "positive",
             "description": "EC delays from MoEFCC, state pollution boards & public hearing requirements"},
            {"feature": "legal_challenges", "label": "Legal Challenges",
             "impact": round(random.uniform(0.05, 0.35), 3), "direction": "positive",
             "description": "Writ petitions, PIL challenges & tribunal proceedings in High Courts"},
            {"feature": "consent_deficit", "label": "Consent Threshold Gap",
             "impact": round(random.uniform(0.03, 0.22), 3), "direction": "positive",
             "description": "Gap between required 70% consent and actual participation rate"},
            {"feature": "rr_inadequacy", "label": "R&R Package Adequacy",
             "impact": round(random.uniform(0.04, 0.18), 3), "direction": "positive",
             "description": "Disparity between offered compensation and market/replacement value"},
        ]

        # Consent rate (negative impact — reduces delay)
        consent_rate = round(random.uniform(0.35, 0.95), 2)
        shap_features.append({
            "feature": "consent_rate", "label": "Consent Rate",
            "impact": round(-0.1 * consent_rate, 3), "direction": "negative",
            "description": f"Consent rate at {consent_rate*100:.0f}% — {'above' if consent_rate > 0.7 else 'below'} 70% threshold",
        })

        # Risk breakdown
        positive_features = [f for f in shap_features if f["impact"] > 0]
        total_impact = sum(f["impact"] for f in positive_features) or 1.0
        risk_breakdown = {}
        for f in positive_features:
            risk_breakdown[f["feature"]] = round(f["impact"] / total_impact, 2)

        # Mitigation — pick relevant actions
        n_mitigations = random.randint(3, 6)
        mitigation = []
        for action, priority, days in random.sample(MITIGATION_ACTIONS, n_mitigations):
            mitigation.append({
                "action": action,
                "priority": priority,
                "estimated_days_saved": days,
            })

        prediction = DelayPrediction(
            id=uuid.uuid4(),
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            predicted_delay_days=predicted_days,
            delay_probability=prob,
            confidence=confidence,
            risk_category=category,
            shap_features=shap_features,
            risk_breakdown=risk_breakdown,
            mitigation_advice=mitigation,
            model_version="v1.0-heuristic",
            inference_time_ms=random.randint(120, 480),
            input_features={
                "stage": project.current_stage,
                "families": project.total_families,
                "budget_cr": project.total_budget_cr,
                "area_ha": project.project_area_ha,
                "state": project.state,
            },
        )
        db.add(prediction)
        predictions.append(prediction)

    db.commit()
    print(f"  [+] {len(predictions)} delay predictions seeded")

    # Print high-risk flags
    high_risk = [p for p in predictions if p.delay_probability > 0.80]
    if high_risk:
        print(f"  [!] {len(high_risk)} HIGH-RISK projects (>80% delay probability):")
        for p in high_risk:
            top_driver = max(
                (f for f in p.shap_features if f["impact"] > 0),
                key=lambda f: f["impact"],
            )
            print(f"      → {p.project_code}: {p.delay_probability*100:.0f}% — {top_driver['label']}")

    return predictions


# ══════════════════════════════════════════════════════════════════════════════
# SEED: POLICY DOCUMENTS
# ══════════════════════════════════════════════════════════════════════════════

POLICY_DOCS = [
    {
        "title": "Land Pooling Policy Reforms in Peri-Urban Regions: A Comparative Assessment",
        "authors": "Dr. Anjali Sharma, Prof. R. Deshpande",
        "year": 2024,
        "doc_type": "research_article",
        "source": "Economic & Political Weekly",
        "url": "https://epw.in/land-pooling-reforms-peri-urban",
        "abstract": (
            "This paper critically examines land pooling policy reforms across 8 Indian states, "
            "focusing on peri-urban transition zones. Analysing 23 schemes implemented between "
            "2007–2024, we find that transparent restitution formulae and guaranteed infrastructure "
            "timelines are the strongest predictors of farmer participation. Delhi's Laluwasane model "
            "achieved 82% consent within 18 months, while Andhra Pradesh CRDA's phased approach "
            "covered 30,000 acres across 29 villages. However, states with weaker institutional "
            "capacity — Bihar, Jharkhand — show displacement of marginal farmers when compensation "
            "is delayed beyond 18 months. We propose a model framework integrating GIS-based parcel "
            "verification with community consent threshold algorithms."
        ),
        "theme": "land-pooling",
        "state": "Delhi",
        "tags": ["land-pooling", "peri-urban", "consent", "infrastructure", "farmer-restitution"],
        "citation_count": 47,
        "download_count": 2340,
        "search_hit_count": 1892,
        "relevance_score": 0.94,
    },
    {
        "title": "Geospatial Watershed Assessment Standards for Semi-Arid Regions",
        "authors": "Dr. K. Rajan, Dr. Meera Iyer, R. Srinivasan",
        "year": 2023,
        "doc_type": "policy_paper",
        "source": "NITI Aayog — Water Resources Division",
        "url": "https://niti.gov.in/geospatial-watershed-standards",
        "abstract": (
            "Establishes national standards for geospatial assessment of watershed health in "
            "India's semi-arid regions using satellite imagery integration. The framework mandates "
            "multi-temporal NDVI analysis, soil moisture anomaly detection, and water body change "
            "detection using Sentinel-2 and Landsat-8 composites. Piloted across 450 watersheds in "
            "Rajasthan, Gujarat, and Maharashtra, the standard defines severity classification "
            "thresholds: NDVI decline >0.15 over 3 years triggers Critical classification. "
            "Includes protocols for community-based ground-truthing and AI-assisted degradation "
            "prediction models."
        ),
        "theme": "water-governance",
        "state": "Rajasthan",
        "tags": ["watershed", "NDVI", "satellite", "semi-arid", "monitoring-standards"],
        "citation_count": 23,
        "download_count": 1567,
        "search_hit_count": 945,
        "relevance_score": 0.91,
    },
    {
        "title": "Narmada Valley Displacement: Supreme Court Judgement on R&R Adequacy",
        "authors": "Supreme Court of India",
        "year": 2017,
        "doc_type": "legal_judgment",
        "source": "Supreme Court of India — Writ Petition (Civil) No. 348/2018",
        "url": "https://sci.gov.in/narmada-rr-judgement-2017",
        "abstract": (
            "Landmark judgement addressing the adequacy of rehabilitation and resettlement for "
            "3,50,000+ persons displaced by the Sardar Sarovar Dam. The Court established that "
            "compensation under the 2013 LARR Act must account for livelihood restoration, not "
            "merely land replacement value. Directed the Narmada Control Authority to complete "
            "R&R for all affected families within 6 months. Set precedent for proportionality "
            "tests in displacement cases: compensation must be 4x market value in rural areas "
            "and must include 3-year livelihood support. Cited in 89 subsequent cases."
        ),
        "theme": "compensation",
        "state": "Madhya Pradesh",
        "tags": ["tribal-rights", "dam-displacement", "Narmada", "Supreme-Court", "R&R"],
        "citation_count": 189,
        "download_count": 5231,
        "search_hit_count": 3421,
        "relevance_score": 0.96,
    },
    {
        "title": "Telangana Dharani Portal: Digital Land Records Integration Framework",
        "authors": "Revenue & Land Records Department, Government of Telangana",
        "year": 2022,
        "doc_type": "gazette",
        "source": "Telangana Gazette Extraordinary — Part I",
        "url": "https://telangana.gov.in/dharani-gazette-2022",
        "abstract": (
            "Official gazette notification establishing the Dharani portal as the single source "
            "of truth for land records in Telangana. Integrates Aadhaar authentication with "
            "digital property registration across all 33 districts. Covers 67 lakh land parcels "
            "with geo-referenced cadastral maps. Mandates Section 22A clearance for all mutations. "
            "Includes data protection framework compliant with DPDP Act 2023. Reduces property "
            "registration time from 45 days to 72 hours."
        ),
        "theme": "digitisation",
        "state": "Telangana",
        "tags": ["Dharani", "Aadhaar", "digital-registry", "cadastral", "property-registration"],
        "citation_count": 34,
        "download_count": 3104,
        "search_hit_count": 2156,
        "relevance_score": 0.89,
    },
    {
        "title": "Climate-Resilient Land Pooling Design: Integrating Flood Risk into Acquisition Frameworks",
        "authors": "Dr. Priya Menon, Dr. Arun Krishnamurthy",
        "year": 2024,
        "doc_type": "case_study",
        "source": "Urban Research & Practice — Taylor & Francis",
        "url": "https://doi.org/10.1080/17535069.2024.climate-land-pooling",
        "abstract": (
            "Proposes a novel framework integrating climate resilience criteria into land pooling "
            "design for India's coastal and flood-prone regions. Analysing Gujarat CRDA's revised "
            "pooling policy and Maharashtra's Coastal Zone Management, we demonstrate that "
            "incorporating 100-year flood maps, sea-level rise projections, and drought risk "
            "indices into parcel restitution algorithms reduces post-acquisition infrastructure "
            "damage by 34%. Case studies from Gujarat's Gulf of Khambhat and Mumbai's western "
            "suburbs show that climate-adjusted compensation multipliers of 2.5x–3.5x adequately "
            "account for long-term risk exposure."
        ),
        "theme": "land-pooling",
        "state": "Gujarat",
        "tags": ["climate", "adaptation", "flood-risk", "land-pooling", "coastal"],
        "citation_count": 12,
        "download_count": 764,
        "search_hit_count": 523,
        "relevance_score": 0.87,
    },
]


def seed_policy_documents(db) -> list:
    """Create 5 policy documents indexed for RAG search."""
    documents = []

    for doc_data in POLICY_DOCS:
        doc = PolicyDocument(
            id=uuid.uuid4(),
            title=doc_data["title"],
            authors=doc_data["authors"],
            year=doc_data["year"],
            doc_type=doc_data["doc_type"],
            source=doc_data["source"],
            url=doc_data["url"],
            abstract=doc_data["abstract"],
            theme=doc_data["theme"],
            state=doc_data["state"],
            tags=doc_data["tags"],
            embedding_model="text-embedding-3-small",
            embedding_dimensions=1536,
            embedding_status="indexed",
            chunk_count=random.randint(8, 45),
            vector_store_id=f"vs-{uuid.uuid4().hex[:12]}",
            citation_count=doc_data["citation_count"],
            cited_by=[f"doc-{uuid.uuid4().hex[:8]}" for _ in range(min(5, doc_data["citation_count"]))],
            references=[
                {"title": fake.sentence(nb_words=8), "authors": fake.name(), "year": random.randint(2015, 2024)}
                for _ in range(random.randint(2, 6))
            ],
            download_count=doc_data["download_count"],
            search_hit_count=doc_data["search_hit_count"],
            relevance_score=doc_data["relevance_score"],
        )
        db.add(doc)
        documents.append(doc)

    db.commit()
    print(f"  [+] {len(documents)} policy documents seeded")
    return documents


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 70)
    print("  VISTARA Database Seeder")
    print("  Indian Land Governance — Realistic Mock Data")
    print("=" * 70)

    # Create tables
    print("\n[1/5] Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("  [+] Tables created (idempotent)")

    db = SessionLocal()

    try:
        print("\n[2/5] Seeding acquisition projects...")
        projects = seed_acquisition_projects(db)

        print("\n[3/5] Seeding digitized land records...")
        records = seed_digitized_records(db)

        print("\n[4/5] Seeding delay predictions...")
        predictions = seed_delay_predictions(db, projects)

        print("\n[5/5] Seeding policy documents...")
        documents = seed_policy_documents(db)

        # Summary
        print("\n" + "=" * 70)
        print("  SEED COMPLETE")
        print("=" * 70)
        print(f"  Acquisition Projects:  {len(projects)}")
        print(f"  Digitized Records:     {len(records)}")
        print(f"  Delay Predictions:     {len(predictions)}")
        print(f"  Policy Documents:      {len(documents)}")
        print()

        # Sample output
        print("  Sample Project:")
        p = projects[0]
        print(f"    Code:  {p.project_code}")
        print(f"    Name:  {p.project_name}")
        print(f"    State: {p.state} | Stage: {p.current_stage}")
        print(f"    Families: {p.total_families} | Budget: ₹{p.total_budget_cr} Cr")
        print(f"    Risk: {p.risk_score*100:.0f}% | Delay: {p.delay_probability*100:.0f}%")
        print()

        print("  Sample Digitized Record:")
        r = records[0]
        print(f"    File:   {r.original_filename}")
        print(f"    Khasra: {r.extracted_fields.get('khasra_number')}")
        print(f"    Khata:  {r.extracted_fields.get('khata_number')}")
        print(f"    Owner:  {r.extracted_fields.get('owner_name')}")
        print(f"    Area:   {r.extracted_fields.get('area_acres')} acres")
        print(f"    Confidence: {r.overall_confidence*100:.0f}% (review: {r.requires_human_review})")
        print()

        high_risk = [p for p in predictions if p.delay_probability > 0.80]
        print(f"  High-Risk Flags (>80%): {len(high_risk)} projects")
        for p in high_risk:
            top = max((f for f in p.shap_features if f["impact"] > 0), key=lambda f: f["impact"])
            print(f"    [{p.project_code}] {p.delay_probability*100:.0f}% — Top driver: {top['label']}")

        print()

    finally:
        db.close()


if __name__ == "__main__":
    main()
