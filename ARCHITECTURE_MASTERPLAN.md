# 🏙️ CLOUD NEXUS PLATFORM – ARCHITECTURE MASTERPLAN

> **Version:** 2.0 (Live Pulse + Cloud Infrastructure Edition)
> **Status:** Production Ready
> **Deployment:** btrt branch

---

## 🏗️ 1. ARCHITECTURE GLOBALE
The platform is built on a modern **Dual-Stack Architecture**, separating the high-performance Frontend from the robust, scalable Backend.

### 🌐 Frontend (The Experience Layer)
**Stack:** React 18, Vite, TypeScript, TailwindCSS, Shadcn UI
**Port:** `8082` (Local Dev)

The frontend is structured into three distinct domains:

1.  **📢 PUBLIC FACING (Marketing)**
    *   **Landing Page**: High-conversion hero sections, pricing grids, service showcases.
    *   **Techno**: Static Generation / SPA mix, SEO Optimized (`react-helmet-async`).
    *   **Key Files**: `src/pages/Index.tsx`, `src/components/Hero.tsx`.

2.  **☁️ CLOUD DASHBOARD (Infrastructure)**
    *   **Role**: Management of Droplets, Domains, Databases, Billing.
    *   **Route**: `/cloud/*` (Guarded by `ProtectedRoute`).
    *   **Layout**: `src/app/cloud/layouts/CloudLayout.tsx` (Dark/Tech Theme).
    *   **Key Modules**: `Droplets.tsx`, `Domains.tsx`, `Billing.tsx`.

3.  **🟠 LIVE PULSE (Intelligence)**
    *   **Role**: Organizational signals, insights, and collective intelligence.
    *   **Route**: `/live-pulse` (Guarded by `ProtectedRoute`).
    *   **Layout**: `src/components/livepulse/LivePulseLayout.tsx` (Light/Orange Theme).
    *   **Key Modules**: `LivePulseDashboard.tsx`, `Signals`, `Insights`.

### ⚙️ Backend (The Engine Room)
**Stack:** Node.js, Express, Prisma ORM, PostgreSQL, Redis, BullMQ
**Port:** `3000` (API)

1.  **🛡️ Security & Auth**
    *   **JWT Authentication**: Secure stateless auth flow.
    *   **RBAC**: Role-Based Access Control (Admin, Owner, Seller, Client).
    *   **Modules**: `src/contexts/AuthContext.tsx`, `backend/server.js`.

2.  **💾 Data Layer (PostgreSQL + Prisma)**
    *   **Models**: 
        *   `User`, `Team` (Identity)
        *   `Droplet`, `Domain`, `Database`, `Snapshot`, `Backup` (Infra)
        *   `ActivityLog` (Audit)
        *   `Invoice`, `Subscription` (Billing)
    *   **Schema**: `prisma/schema.prisma`.

3.  **⚡ Performance Layer (Redis)**
    *   **Caching**: API response caching for high-traffic endpoints (`backend/redis.js`).
    *   **Session**: Distributed session management.
    *   **Rate Limiting**: DDOS protection and API throttling.

4.  **📨 Async Workers (BullMQ)**
    *   **Queues**: `email`, `droplet-provisioning`, `backups`, `snapshots`.
    *   **Processing**: Background jobs decoupled from the main event loop (`backend/queue.js`).

---

## 📂 2. DIRECTORY MAP (Updated)

```
cloud-nexus-platform/
├── 📂 backend/                 # Node.js Server
│   ├── queue.js                # BullMQ Worker setup
│   ├── redis.js                # Redis Client & Utilities
│   └── ...
├── 📂 prisma/
│   └── schema.prisma           # Database Schema (Single Source of Truth)
├── 📂 public/                  # Static Assets
│   ├── favicon.png             # New Custom Logo
│   ├── logo.png                # New Branding
│   └── manifest.json           # PWA Manifest
├── 📂 src/
│   ├── 📂 app/                 # Modular App Domains
│   │   ├── 📂 cloud/           # Cloud Infrastructure Module
│   │   │   ├── 📂 components/  # Cloud-specific UI
│   │   │   ├── 📂 layouts/     # CloudLayout (Sidebar, Shell)
│   │   │   └── 📂 pages/       # Droplets, Billing, etc.
│   │   └── 📂 routes/          # Route Definitions
│   │       └── 📂 livepulse/   # Live Pulse Dashboard Logic
│   ├── 📂 components/
│   │   ├── 📂 livepulse/       # Live Pulse UI & Layouts
│   │   ├── 📂 ui/              # Shadcn Universal UI Kit
│   │   └── ...
│   ├── 📂 contexts/            # Global State
│   │   ├── AuthContext.tsx     # user, login, logout
│   │   ├── CloudContext.tsx    # droplets, domains state
│   │   └── LivePulseContext.tsx # signals, insights state
│   ├── 📂 hooks/               # Custom React Hooks
│   ├── 📂 lib/                 # Utilities (utils, i18n)
│   ├── 📂 types/               # TypeScript Definitions
│   ├── App.tsx                 # Main Router & Provider Assembly
│   └── main.tsx                # Entry Point
├── server.js                   # Express App Entry Point
├── vite.config.ts              # Build Configuration (Port 8082)
└── ...
```

---

## 🚀 3. DEPLOYMENT STRATEGY

### 🚢 Production (Vercel + DigitalOcean)
*   **Frontend**: Deployed to Vercel (Auto-deployment from `main`).
*   **Backend**: Containerized on DigitalOcean App Platform (Docker).
*   **Database**: Managed PostgreSQL on DigitalOcean.
*   **Cache**: Managed Redis on DigitalOcean.

### 🛠️ Local Development
*   **Command**: `npm run dev`
*   **Port**: `localhost:8082`
*   **DB**: Local Postgres or Docker Container.

---

## ✅ 4. RECENT POWER UPS (Session Highlights)
*   **Branding Overhaul**: Complete removal of "Lovable" branding. Custom Gorilla logo deployed.
*   **Backend Muscle**: Added Redis Caching & Bull Queues for enterprise-grade performance.
*   **Live Pulse**: Re-integrated the Organizational Intelligence module properly via `main` branch fusion.
*   **Schema Upgrade**: Expanded Prisma schema for full infrastructure management (Snapshots, Backups).

---

*Verified and Documented by Antigravity AI*
