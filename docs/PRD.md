# Product Requirements Document (PRD)
# CDO MSWIE DSS - Cagayan de Oro Municipal Solid Waste Integrated Energy Decision Support System

**Version:** 2.0  
**Date:** January 17, 2026  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Vision
The CDO MSWIE DSS (Cagayan de Oro Municipal Solid Waste Integrated Energy Decision Support System) is a comprehensive web-based platform designed to support decision-making for waste-to-energy (WtE) initiatives in Cagayan de Oro City, Philippines. The system integrates waste characterization analysis, technology comparison, site selection, financial modeling, environmental impact assessment, and policy recommendations into a unified decision support tool.

### 1.2 Target Users
| Role | Description | Primary Modules |
|------|-------------|-----------------|
| Super Admin | Full system access, user management, configuration | All modules + Administration |
| Municipal Analyst | Waste data management and analysis | Waste Analysis, Dashboard, Data Management |
| Environmental Specialist | Environmental impact assessment | Environmental Impact, Multi-Criteria Analysis |
| GIS Planner | Site selection and mapping | Site Suggestions, Dashboard |
| Technologist/Engineer | Technology evaluation and monitoring | Technology Comparison, WtE Monitoring |
| Policy Maker | Policy development and compliance | Policy Assistant, Multi-Criteria Analysis |
| Read-Only Viewer | View-only access to dashboards | Dashboard (limited access) |

---

## 2. System Architecture

### 2.1 Technology Stack
- **Frontend:** React 18.3 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context + TanStack React Query
- **Backend:** Supabase (Lovable Cloud)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth with Role-Based Access Control
- **Charts/Visualization:** Recharts
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router DOM v6

### 2.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │    React     │  │   shadcn/ui  │  │     Recharts         │   │
│  │  Components  │  │   Components │  │   Visualizations     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    Auth Context                            │  │
│  │              (Role-Based Access Control)                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Auth/Users  │  │   Database   │  │    Edge Functions    │   │
│  │              │  │  PostgreSQL  │  │    (Serverless)      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Row Level Security (RLS)                      │  │
│  │           Role-Based Data Access Policies                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model & Relationships

### 3.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   auth.users     │         │     profiles     │         │   user_roles     │
│ (Supabase Auth)  │────────►│                  │◄────────│                  │
├──────────────────┤    1:1  ├──────────────────┤   1:N   ├──────────────────┤
│ id (PK)          │         │ id (PK, FK)      │         │ id (PK)          │
│ email            │         │ email            │         │ user_id (FK)     │
│ created_at       │         │ name             │         │ role (enum)      │
│ raw_user_meta    │         │ created_at       │         │ created_at       │
└──────────────────┘         │ updated_at       │         └──────────────────┘
                             └──────────────────┘                  │
                                      │                            │
                                      │                   ┌────────┴────────┐
                                      │                   │   app_role      │
                                      │                   │     (enum)      │
                                      │                   ├─────────────────┤
                                      │                   │ super_admin     │
                                      │                   │ municipal_analyst│
                                      │                   │ environmental_  │
                                      │                   │   specialist    │
                                      │                   │ gis_planner     │
                                      │                   │ technologist    │
                                      │                   │ policy_maker    │
                                      │                   │ viewer          │
                                      │                   └─────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   waste_data     │       │scenario_simulations│     │  wte_sites       │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ municipality     │       │ name             │       │ name             │
│ waste_type       │       │ description      │       │ location_name    │
│ quantity         │       │ technology       │       │ latitude         │
│ unit             │       │ waste_input      │       │ longitude        │
│ collection_date  │       │ capacity         │       │ capacity         │
│ created_by (FK)  │       │ results (JSONB)  │       │ technology       │
│ created_at       │       │ created_by (FK)  │       │ status           │
│ updated_at       │       │ created_at       │       │ environmental_   │
└──────────────────┘       │ updated_at       │       │   score          │
                           └──────────────────┘       │ economic_score   │
                                                      │ created_by (FK)  │
                                                      │ created_at       │
                                                      │ updated_at       │
                                                      └──────────────────┘
          │                                                    │
          │                                                    │
          ▼                                                    ▼
┌──────────────────┐                              ┌──────────────────┐
│technology_       │                              │wte_monitoring_   │
│  comparison      │                              │      data        │
├──────────────────┤                              ├──────────────────┤
│ id (PK)          │                              │ id (PK)          │
│ name             │                              │ site_id (FK)     │
│ type             │                              │ timestamp        │
│ description      │                              │ power_output     │
│ capacity_range   │                              │ efficiency       │
│ efficiency       │                              │ primary_airflow  │
│ capital_cost     │                              │ secondary_airflow│
│ operating_cost   │                              │ furnace_pressure │
│ environmental_   │                              │ oxygen_level     │
│   impact         │                              │ co_level         │
│ created_by (FK)  │                              │ co2_level        │
│ created_at       │                              │ nox_level        │
│ updated_at       │                              │ so2_level        │
└──────────────────┘                              │ steam_flow       │
                                                  │ steam_temperature│
                                                  │ steam_pressure   │
                                                  │ created_at       │
                                                  └──────────────────┘
```

### 3.2 Data Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| auth.users → profiles | 1:1 | Each authenticated user has one profile |
| auth.users → user_roles | 1:N | Each user can have multiple roles |
| profiles → waste_data | 1:N | Analysts create waste data records |
| profiles → scenario_simulations | 1:N | Users create their own simulations |
| profiles → wte_sites | 1:N | GIS planners create site entries |
| profiles → technology_comparison | 1:N | Technologists manage technology data |
| wte_sites → wte_monitoring_data | 1:N | Each site has multiple monitoring records |

### 3.3 Database Tables Detail

#### 3.3.1 profiles
Stores extended user information beyond Supabase Auth.
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3.3.2 user_roles
Manages role-based access control with enum-based roles.
```sql
CREATE TYPE app_role AS ENUM (
  'super_admin', 'municipal_analyst', 'environmental_specialist',
  'gis_planner', 'technologist', 'policy_maker', 'viewer'
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);
```

#### 3.3.3 waste_data
Stores municipal waste collection and characterization data.
```sql
CREATE TABLE waste_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  collection_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3.3.4 scenario_simulations
Stores user-created WtE simulation scenarios and results.
```sql
CREATE TABLE scenario_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  technology TEXT,
  waste_input NUMERIC,
  capacity NUMERIC,
  results JSONB,  -- Stores energy output, carbon reduction, costs, etc.
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3.3.5 wte_sites
Stores potential and operational WtE facility locations.
```sql
CREATE TABLE wte_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  capacity NUMERIC NOT NULL,
  technology TEXT NOT NULL,
  status TEXT NOT NULL,  -- 'proposed', 'under_review', 'approved', 'operational'
  environmental_score NUMERIC,
  economic_score NUMERIC,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3.3.6 technology_comparison
Stores WtE technology specifications and comparisons.
```sql
CREATE TABLE technology_comparison (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'gasification', 'incineration', 'anaerobic_digestion', etc.
  description TEXT,
  capacity_range TEXT,
  efficiency NUMERIC,
  capital_cost NUMERIC,
  operating_cost NUMERIC,
  environmental_impact TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3.3.7 wte_monitoring_data
Stores real-time operational data from WtE facilities.
```sql
CREATE TABLE wte_monitoring_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES wte_sites(id),
  timestamp TIMESTAMPTZ DEFAULT now(),
  power_output NUMERIC,
  efficiency NUMERIC,
  primary_airflow NUMERIC,
  secondary_airflow NUMERIC,
  furnace_pressure NUMERIC,
  oxygen_level NUMERIC,
  co_level NUMERIC,
  co2_level NUMERIC,
  nox_level NUMERIC,
  so2_level NUMERIC,
  steam_flow NUMERIC,
  steam_temperature NUMERIC,
  steam_pressure NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Security Model

### 4.1 Row Level Security (RLS) Policies

All tables have RLS enabled with role-based access control using the `has_role()` function:

```sql
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

#### RLS Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | All authenticated | Own profile | Own profile | ❌ |
| user_roles | All authenticated | Super admin | Super admin | Super admin |
| waste_data | All authenticated | Analysts, Specialists, Admin | Analysts, Admin | Super admin |
| scenario_simulations | Own + Admin | Own | Own | Own + Admin |
| wte_sites | All authenticated | GIS planners, Admin | GIS planners, Admin | GIS planners, Admin |
| technology_comparison | All authenticated | Technologists, Admin | Technologists, Admin | Technologists, Admin |
| wte_monitoring_data | All authenticated | Technologists, Admin | ❌ | ❌ |

### 4.2 Module Access Control

Each role has access to specific modules defined in the AuthContext:

```typescript
const roleModuleAccess = {
  super_admin: ['dashboard', 'wasteAnalysis', 'technologyComparison', 
    'siteSuggestions', 'scenarioSimulation', 'financialAnalysis', 
    'environmentalImpact', 'multiCriteriaAnalysis', 'policyAssistant',
    'wteMonitoring', 'dataManagement', 'userManagement', 'settings', 'logs'],
  municipal_analyst: ['dashboard', 'wasteAnalysis', 'scenarioSimulation', 
    'dataManagement'],
  environmental_specialist: ['dashboard', 'environmentalImpact', 
    'multiCriteriaAnalysis', 'wasteAnalysis'],
  gis_planner: ['dashboard', 'siteSuggestions', 'wasteAnalysis'],
  technologist: ['dashboard', 'technologyComparison', 'wteMonitoring', 
    'scenarioSimulation'],
  policy_maker: ['dashboard', 'policyAssistant', 'multiCriteriaAnalysis', 
    'financialAnalysis'],
  viewer: ['dashboard']
};
```

---

## 5. Module Specifications

### 5.1 Dashboard
**Purpose:** Central overview of key metrics and quick access to all modules.

**Features:**
- Key performance indicators (Total Waste, CO₂ Emissions, Energy Potential)
- Waste collection trend visualization
- Processing efficiency metrics
- Quick access cards to all DSS modules

**Data Sources:**
- waste_data (aggregated)
- wte_monitoring_data (aggregated)

### 5.2 Waste Analysis
**Purpose:** Analyze waste characterization and composition by district.

**Features:**
- District-level waste data table with annual volumes
- Organic and recyclable content percentages
- Collection efficiency rates
- Direct "Simulate" action to run WtE scenarios
- Waste composition pie charts
- Energy value by waste type (calorific values)
- Energy generation potential by technology

**Data Flow:**
```
District Data → Simulate Button → Scenario Simulation Page
                                  (with pre-populated parameters)
```

### 5.3 Scenario Simulation
**Purpose:** Model WtE scenarios based on district waste data.

**Features:**
- Pre-populated parameters from selected district
- Technology selection (Gasification, Incineration, Anaerobic Digestion)
- Real-time calculation of:
  - Energy output (MWh/year)
  - Carbon reduction (tons CO₂/year)
  - Revenue estimates
  - Landfill diversion rates
- Technology comparison charts

**Calculation Logic:**
```typescript
// Gasification
energyOutput = residualWaste × 0.8 × (efficiency / 100)
carbonReduction = energyOutput × 0.6

// Anaerobic Digestion
energyOutput = organicWaste × 0.5 × (efficiency / 100)
carbonReduction = energyOutput × 0.7

// Incineration
energyOutput = residualWaste × 0.65 × (efficiency / 100)
carbonReduction = energyOutput × 0.45
```

### 5.4 Technology Comparison
**Purpose:** Compare different WtE technologies for suitability.

**Features:**
- Side-by-side technology comparison
- Key metrics: Energy output, CO₂ reduction, CAPEX
- Technology cards with detailed specifications

**Technologies Covered:**
- Gasification
- Anaerobic Digestion
- Mass-burn Incineration
- Pyrolysis
- Refuse-Derived Fuel (RDF)

### 5.5 Site Suggestions
**Purpose:** Identify optimal locations for WtE facilities.

**Features:**
- Interactive map placeholder (for GIS integration)
- Site scoring based on:
  - Distance to waste sources
  - Community acceptance
  - Environmental factors
  - Economic viability
- Site comparison cards

### 5.6 Financial Analysis
**Purpose:** Calculate ROI and economic viability of WtE projects.

**Features:**
- ROI Calculator with configurable parameters:
  - Technology type
  - Processing capacity (tons/day)
  - Capital cost
  - Operational costs
  - Energy price
  - Discount rate
  - Project life
- Financial outputs:
  - Net Present Value (NPV)
  - Internal Rate of Return (IRR)
  - Payback period
  - Annual revenue/profit projections
- Cash flow visualization
- Sensitivity analysis

### 5.7 Environmental Impact
**Purpose:** Assess environmental effects of WtE solutions.

**Features:**
- Air emissions comparison by technology
- Emissions compliance analysis
- Carbon footprint comparison
- Land use analysis
- Resource recovery assessment
- Ecosystem impact indicators
- Life cycle impact visualization

**Tabs:**
1. Air Emissions
2. Carbon Footprint
3. Land Use
4. Resource Recovery
5. Ecosystem Impact

### 5.8 Multi-Criteria Decision Analysis (MCDA)
**Purpose:** Weighted evaluation of technologies across multiple criteria.

**Features:**
- Adjustable criteria weights (must sum to 100%):
  - Economic (20% default)
  - Environmental (30% default)
  - Social (15% default)
  - Technical (20% default)
  - Regulatory (15% default)
- Radar charts for each technology
- Ranked results table
- Recommendation summary

**Scoring System:**
```typescript
totalScore = Σ(criteriaScore × criteriaWeight)
// Each criteria score is on a 1-10 scale
```

### 5.9 Policy Assistant
**Purpose:** Generate policy recommendations for WtE implementation.

**Features:**
- Pre-defined policy templates:
  - Waste Segregation Ordinance
  - WtE Partnership Framework
  - Renewable Energy Credits
  - Community Benefits Agreement
- Key metrics per policy:
  - Estimated impact
  - Implementation complexity
  - Timeline

### 5.10 WtE Monitoring
**Purpose:** Real-time monitoring of operational WtE facilities.

**Features:**
- Live metrics display:
  - Furnace temperature
  - Power output
  - Steam flow
  - Efficiency
- Emissions monitoring (CO₂, NOₓ, SO₂, Particulates)
- Alert system for threshold violations
- Historical trend charts
- Tabbed interface: Overview, Airflow, Emissions, Energy

**Data Refresh:** Every 2 seconds (simulated)

### 5.11 Data Management
**Purpose:** Centralized data upload, viewing, and visualization.

**Features:**
- File upload (Excel/CSV support)
- Data viewer and editor
- Data visualization tools
- External data source connections
- Advanced import options

### 5.12 User Management (Admin Only)
**Purpose:** Manage user accounts and roles.

**Features:**
- User listing with search/filter
- Role assignment
- Status management (active/inactive)
- Password reset functionality
- Last login tracking

---

## 6. Data Flow Diagrams

### 6.1 Waste Analysis to Simulation Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Waste Analysis │     │ Route Navigation │     │   Scenario      │
│      Page       │────►│   with State    │────►│   Simulation    │
│                 │     │                 │     │      Page       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
  ┌───────────┐         ┌───────────┐          ┌───────────┐
  │ District  │         │ wasteVolume│         │ Technology │
  │   Data    │         │ organicPct │         │ Selection  │
  │  Table    │         │recyclablePct│        │ & Results  │
  └───────────┘         └───────────┘          └───────────┘
```

### 6.2 User Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │     │  AuthContext│     │  Supabase   │     │  Protected  │
│    Page     │────►│   login()   │────►│    Auth     │────►│   Route     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ localStorage│     │ user_roles  │
                    │  (session)  │     │  (RBAC)     │
                    └─────────────┘     └─────────────┘
```

---

## 7. API & Database Functions

### 7.1 Database Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `has_role(user_id, role)` | Check if user has specific role | Boolean |
| `handle_new_user()` | Trigger: Create profile + assign viewer role | Trigger |
| `update_updated_at_column()` | Trigger: Update timestamp on record change | Trigger |

### 7.2 Supabase Client Usage

```typescript
import { supabase } from "@/integrations/supabase/client";

// Example: Fetch waste data
const { data, error } = await supabase
  .from('waste_data')
  .select('*')
  .order('collection_date', { ascending: false });

// Example: Insert simulation
const { data, error } = await supabase
  .from('scenario_simulations')
  .insert({
    name: 'District A Simulation',
    technology: 'gasification',
    waste_input: 85000,
    results: { energyOutput: 12500, carbonReduction: 7500 },
    created_by: user.id
  });
```

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load time: < 2 seconds
- API response time: < 500ms
- Chart rendering: < 1 second
- Real-time monitoring update: Every 2 seconds

### 8.2 Scalability
- Support for 100+ concurrent users
- Database designed for millions of monitoring records
- Supabase auto-scaling infrastructure

### 8.3 Security
- Row Level Security on all tables
- Role-based access control
- Secure session management
- HTTPS-only communication

### 8.4 Reliability
- 99.9% uptime target
- Automatic database backups
- Error logging and monitoring

### 8.5 Usability
- Responsive design (mobile-friendly)
- Accessible UI components (ARIA)
- Intuitive navigation
- Visual feedback for actions

---

## 9. Future Enhancements

### 9.1 Phase 2 Features
- [ ] Real GIS integration (Mapbox/Google Maps)
- [ ] PDF report generation
- [ ] Email notifications for alerts
- [ ] Data export (CSV/Excel)
- [ ] Multi-language support (Filipino, Cebuano)

### 9.2 Phase 3 Features
- [ ] Machine learning predictions for waste volumes
- [ ] Integration with IoT sensors
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

---

## 10. Glossary

| Term | Definition |
|------|------------|
| WtE | Waste-to-Energy - technologies that convert waste materials into usable energy |
| MSW | Municipal Solid Waste - garbage from homes, businesses, and institutions |
| MCDA | Multi-Criteria Decision Analysis - structured approach for complex decisions |
| RDF | Refuse-Derived Fuel - fuel produced from solid waste processing |
| RLS | Row Level Security - database-level access control |
| NPV | Net Present Value - financial metric for project valuation |
| IRR | Internal Rate of Return - profitability metric |
| CAPEX | Capital Expenditure - one-time investment costs |
| OPEX | Operational Expenditure - ongoing operational costs |

---

## 11. Appendix

### 11.1 Demo Accounts

| Email | Role | Password |
|-------|------|----------|
| admin@example.com | Super Admin | password |
| analyst@example.com | Municipal Analyst | password |
| env@example.com | Environmental Specialist | password |
| gis@example.com | GIS Planner | password |
| tech@example.com | Technologist | password |
| policy@example.com | Policy Maker | password |
| viewer@example.com | Read-Only Viewer | password |

### 11.2 File Structure

```
src/
├── components/
│   ├── data/           # Data management components
│   ├── layout/         # MainLayout, navigation
│   ├── ui/             # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx # Authentication & RBAC
├── hooks/              # Custom React hooks
├── integrations/
│   └── supabase/       # Supabase client & types
├── lib/                # Utilities
└── pages/              # Page components
    ├── Dashboard.tsx
    ├── WasteAnalysis.tsx
    ├── ScenarioSimulation.tsx
    ├── TechnologyComparison.tsx
    ├── SiteSuggestions.tsx
    ├── FinancialAnalysis.tsx
    ├── EnvironmentalImpact.tsx
    ├── MultiCriteriaAnalysis.tsx
    ├── PolicyAssistant.tsx
    ├── WteMonitoring.tsx
    ├── DataManagement.tsx
    ├── UserManagement.tsx
    ├── Settings.tsx
    ├── Logs.tsx
    └── Login.tsx
```

---

*Document maintained by CDO MSWIE DSS Development Team*
