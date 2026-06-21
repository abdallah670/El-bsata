# 🍲 Wasat Elbasata — Migration to .NET + Angular

Migrating the existing React/Node.js restaurant ordering app to a proper full-stack architecture with **ASP.NET Core Web API** as the backend and **Angular** as the frontend.

---

## Overview

The current project is a single-page React app with an Express server bundled together via Vite. We will separate this into two distinct projects:

1. **`ElBsata.API`** — ASP.NET Core 8 Web API (C#), replacing `server.ts`
2. **`el-bsata-angular`** — Angular 17+ app, replacing the React frontend (`App.tsx`, `data.ts`, etc.)

All existing features will be preserved: menu browsing, cart management, GPS checkout, order submission, admin panel, and email notifications.

---

## User Review Required

> [!IMPORTANT]
> **Project Layout**: The two projects will be placed as sibling folders inside `f:\Meno\El-bsata\`:
> - `f:\Meno\El-bsata\ElBsata.API\` — .NET backend
> - `f:\Meno\El-bsata\el-bsata-angular\` — Angular frontend
> The old React files (`src/`, `server.ts`, `vite.config.ts`, etc.) will remain untouched unless you ask to remove them.

> [!IMPORTANT]
> **Email (Nodemailer → System.Net.Mail)**: The backend will use `SmtpClient` or `MailKit` for email. SMTP credentials will still be loaded from a `.env` / `appsettings.json` file.

> [!IMPORTANT]
> **Database**: Currently orders are in-memory only (array). The .NET backend will also use **in-memory storage** to match current behavior. If you want SQL Server/PostgreSQL persistence, let me know.

---

## Open Questions

> [!WARNING]
> **Angular version preference**: I'll use Angular 17+ (standalone components, no NgModules). Is that okay, or do you prefer an older NgModule-based approach?

> [!WARNING]
> **CORS**: Since Angular (port 4200) and .NET API (port 5000/7000) run on different ports during development, CORS will be configured. In production, you can either serve Angular from .NET static files or deploy separately. Which do you prefer?

---

## Proposed Changes

### .NET Backend (`ElBsata.API`)

#### [NEW] `ElBsata.API/` — ASP.NET Core 8 Web API project

```
ElBsata.API/
├── Controllers/
│   └── OrdersController.cs     — GET /api/orders, POST /api/order
├── Models/
│   ├── MenuItem.cs
│   ├── CartItem.cs
│   ├── CustomerInfo.cs
│   ├── Coordinates.cs
│   └── Order.cs
├── Services/
│   ├── OrderService.cs         — in-memory order storage + logic
│   └── EmailService.cs         — MailKit/SmtpClient email sender
├── Data/
│   └── MenuData.cs             — static menu items & categories (ported from data.ts)
├── appsettings.json            — SMTP config, port
├── Program.cs                  — app setup, CORS, DI, Swagger
└── ElBsata.API.csproj
```

**Key .NET packages**:
- `MailKit` — for sending HTML emails (drop-in for Nodemailer)
- `Microsoft.AspNetCore.OpenApi` + `Swashbuckle` — Swagger UI
- `dotenv.net` or just `appsettings.json` for config

---

### Angular Frontend (`el-bsata-angular`)

#### [NEW] `el-bsata-angular/` — Angular 17 standalone app

```
el-bsata-angular/
├── src/
│   ├── app/
│   │   ├── models/            — TypeScript interfaces (MenuItem, Order, etc.)
│   │   ├── services/
│   │   │   ├── menu.service.ts
│   │   │   ├── cart.service.ts
│   │   │   └── order.service.ts   — HTTP calls to .NET API
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── hero/
│   │   │   ├── menu-grid/
│   │   │   ├── menu-card/
│   │   │   ├── cart-drawer/
│   │   │   ├── checkout-form/
│   │   │   ├── toast/
│   │   │   ├── admin-login/
│   │   │   └── admin-dashboard/
│   │   ├── app.component.ts   — root component (standalone)
│   │   └── app.config.ts      — providers, HttpClient, Router
│   ├── styles.css             — global styles (same dark warm palette)
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

**Angular features used**:
- Standalone components (Angular 17 default)
- `HttpClientModule` → calls to .NET API
- `@angular/animations` → replaces `motion/react`
- `FormsModule` / `ReactiveFormsModule` → checkout form
- Signal-based state for cart (Angular 17 signals)
- Lucide icons via `lucide-angular` package

**Preserved design**: Same exact color palette (`#1a1410`, `#b8863a`, `#d4a24e`), RTL layout, typography, and all animations.

---

## Verification Plan

### Automated Tests
- `dotnet build` — confirms .NET project compiles cleanly
- `ng build` — confirms Angular project builds without errors

### Manual Verification
1. .NET API running: `http://localhost:5000/swagger` shows all endpoints
2. Angular dev server: `http://localhost:4200` shows the restaurant homepage
3. Menu loads from .NET API (static data served via `GET /api/menu`)
4. Cart → Checkout → Order submission → order appears in admin panel
5. Admin login (`admin` / `123`) works and shows order list + email preview
