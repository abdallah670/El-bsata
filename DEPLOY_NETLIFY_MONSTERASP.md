# El-Bsata Deployment Guide  
## Frontend → Netlify · Backend → MonsterASP

> **Architecture:**  
> Angular SPA is served from Netlify's global CDN. API calls are proxied via `/_redirects` to the .NET backend hosted on MonsterASP.  

```
User ──► Netlify (Angular SPA) ──► /api/* ──► MonsterASP (.NET API)
```

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Backend — MonsterASP Deployment](#2-backend--monsterasp-deployment)
3. [Frontend — Netlify Deployment](#3-frontend--netlify-deployment)
4. [CORS Configuration](#4-cors-configuration)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Database Migration](#6-database-migration)
7. [Verification Checklist](#7-verification-checklist)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

| Item | Version |
|------|---------|
| .NET SDK | 10.0 or later |
| Node.js | 18+ |
| Angular CLI | 19+ (comes with the project) |
| GitHub account | With repo pushed |
| MonsterASP account | Sign up at [monsterasp.net](https://monsterasp.net) |
| Netlify account | Sign up at [netlify.com](https://netlify.com) |
| SQL Server database | Provided by MonsterASP or your own |

**First — push the current code to GitHub:**

```bash
git remote add origin https://github.com/abdallah670/El-bsata.git
git push -u origin master
```

---

## 2. Backend — MonsterASP Deployment

### 2.1 Create the Web App on MonsterASP

1. Log in to [MonsterASP](https://monsterasp.net)
2. Go to **My ASP.NET** → **Add Website**
3. Choose:
   - **Runtime:** .NET 10.0
   - **Name:** `elbsata-api` (or your preferred subdomain → `elbsata-api.monsterasp.net`)
   - **Database:** Select SQL Server when prompted (MonsterASP will give you a connection string)
4. Note down the **FTP credentials** and the **SQL Server connection string** from the dashboard

### 2.2 Configure Environment Variables on MonsterASP

In the MonsterASP control panel, go to **Settings** → **Environment Variables** and add these:

| Key | Example Value | Notes |
|-----|--------------|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Required |
| `ConnectionStrings__DefaultConnection` | `Server=…;Database=…;User Id=…;Password=…;TrustServerCertificate=True;` | From MonsterASP DB panel |
| `JwtSettings__Issuer` | `https://elbsata-api.monsterasp.net` | Your MonsterASP site URL |
| `JwtSettings__Audience` | `https://elbsata-api.monsterasp.net` | Same as Issuer |
| `JwtSettings__Key` | `<generate-a-long-random-string-32+chars>` | Use a random secret |
| `Smtp__Host` | `smtp.gmail.com` | Your SMTP server |
| `Smtp__Port` | `587` | SMTP port |
| `Smtp__User` | `your-email@gmail.com` | SMTP username |
| `Smtp__Pass` | `your-app-password` | SMTP password or app password |
| `Smtp__Recipient` | `kitchen@example.com` | Email that receives orders |

**Important:** On MonsterASP, use `__` (double underscore) as the separator for nested config keys. This is how .NET reads environment variables as configuration sections.

### 2.3 Build & Publish

```bash
# From the repo root
cd ElBsata.API

# Restore dependencies
dotnet restore

# Build for Release
dotnet build -c Release --no-restore

# Publish to a folder
dotnet publish -c Release -o ./publish --no-build
```

### 2.4 Upload via FTP

1. Install an FTP client (FileZilla, WinSCP, or use MonsterASP's web FTP)
2. Connect using the FTP credentials from MonsterASP
3. Upload **all files** from `ElBsata.API/publish/` to the MonsterASP site root directory (usually `/httpdocs/` or similar)
4. MonsterASP will automatically detect the .NET application and run it

### 2.5 Verify the Backend

Visit `https://elbsata-api.monsterasp.net/swagger` — you should see the Swagger UI.

Test an endpoint:

```bash
curl https://elbsata-api.monsterasp.net/api/menu
```

You should get a JSON response with menu items.

---

## 3. Frontend — Netlify Deployment

### 3.1 Update the API URL

Edit `el-bsata-angular/src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://elbsata-api.monsterasp.net/api',
  resourceUrl: 'https://elbsata-api.monsterasp.net'
};
```

Replace `elbsata-api.monsterasp.net` with your actual MonsterASP site URL.

### 3.2 Create the `_redirects` File

Create `el-bsata-angular/src/_redirects` with this content:

```
/api/*  https://elbsata-api.monsterasp.net/api/:splat  200
/*      /index.html   200
```

**What this does:**
- Line 1: All requests starting with `/api/` are proxied to your MonsterASP backend (with status 200 — silent proxy)
- Line 2: All other routes serve `index.html` for client-side routing

**Important:** The `_redirects` file must be placed at the **root of the publish directory** (inside `browser/`). The Angular build copies `src/` files to the output automatically, but `_redirects` is not an Angular source file — we'll handle this in the build step.

### 3.3 Update angular.json to Include _redirects

Add `_redirects` to the assets array in `angular.json`:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/_redirects"
]
```

This ensures Netlify's `_redirects` file is included in the build output.

### 3.4 Build the Angular App

```bash
cd el-bsata-angular

# Install dependencies
npm install

# Build for production
ng build --configuration production
```

The output will be in: `el-bsata-angular/dist/el-bsata-angular/browser/`

Verify `browser/_redirects` exists.

### 3.5 Deploy to Netlify

#### Option A — Netlify Drop (Drag & Drop)

1. Go to [Netlify](https://app.netlify.com) → **Sites** → **Drag and drop your site folder here**
2. Drag the `browser` folder from `el-bsata-angular/dist/el-bsata-angular/browser/` onto the drop zone
3. Wait for deployment to finish
4. Your site URL will be something like `https://random-name-123456.netlify.app`

#### Option B — Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=el-bsata-angular/dist/el-bsata-angular/browser/
```

#### Option C — Connect GitHub Repository (Recommended for auto-deploys)

1. In Netlify dashboard → **Add new site** → **Import an existing project**
2. Connect to GitHub and select `abdallah670/El-bsata`
3. Configure build settings:
   - **Base directory:** `el-bsata-angular`
   - **Build command:** `npm ci && ng build --configuration production`
   - **Publish directory:** `dist/el-bsata-angular/browser`
4. Click **Deploy**

**Note for GitHub integration:** Ensure the `_redirects` file is committed to the repo at `el-bsata-angular/src/_redirects` and the `angular.json` assets array includes it.

### 3.6 Custom Domain (Optional)

1. In Netlify → **Site settings** → **Domain management**
2. Add your custom domain (e.g., `elbsata.com`)
3. Follow Netlify's DNS configuration instructions
4. Netlify will automatically provision a free SSL certificate via Let's Encrypt

### 3.7 Verify the Frontend

Visit your Netlify URL (e.g., `https://your-site.netlify.app`). You should see:
- The restaurant menu loads correctly
- Clicking an order triggers the API call to MonsterASP
- The admin dashboard loads orders from the backend

---

## 4. CORS Configuration

Update `ElBsata.API/Program.cs` to allow requests from your Netlify domain:

```csharp
// ─── CORS ────────────────────────────────────────────────────────────────────
builder.Services.AddCors(opt =>
{
    // Development
    opt.AddPolicy("AngularDev", policy =>
        policy.WithOrigins("http://localhost:4200", "http://localhost:4000")
              .AllowAnyHeader()
              .AllowAnyMethod());

    // Production — Netlify
    opt.AddPolicy("Netlify", policy =>
        policy.WithOrigins(
              "https://elbsata.netlify.app",           // Replace with your Netlify URL
              "https://your-custom-domain.com"          // If using a custom domain
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});
```

Then in the middleware section, use the production policy in Production:

```csharp
// Use appropriate CORS policy based on environment
if (app.Environment.IsDevelopment())
{
    app.UseCors("AngularDev");
}
else
{
    app.UseCors("Netlify");
}
```

After making this change, rebuild and re-deploy the API to MonsterASP.

---

## 5. Environment Variables Reference

All values are set in MonsterASP's **Environment Variables** section (NOT in `appsettings.json`).

### JWT Configuration
```bash
JwtSettings__Issuer=https://elbsata-api.monsterasp.net
JwtSettings__Audience=https://elbsata-api.monsterasp.net
JwtSettings__Key=YourSuperSecretKeyThatIsAtLeast32CharactersLong
```

### Database Connection
```bash
ConnectionStrings__DefaultConnection=Server=sql.monsterasp.net;Database=your_db;User Id=your_user;Password=your_password;TrustServerCertificate=True;
```

### SMTP (Email)
```bash
Smtp__Host=smtp.gmail.com
Smtp__Port=587
Smtp__User=your-email@gmail.com
Smtp__Pass=your-app-password
Smtp__Recipient=binfof123@gmail.com
```

### App Settings
```bash
ASPNETCORE_ENVIRONMENT=Production
```

---

## 6. Database Migration

### 6.1 Using `dotnet ef` (if you have direct DB access)

If MonsterASP provides direct SQL Server access (SSMS or connection string):

```bash
cd ElBsata.API
dotnet ef database update --connection "Server=sql.monsterasp.net;Database=your_db;User Id=your_user;Password=your_password;TrustServerCertificate=True;"
```

### 6.2 Using the Auto-Migration Approach

The application is configured to auto-migrate on startup via `app.UseDbMigration()` or similar in `Program.cs`. If not already present, you can modify `Program.cs` to apply migrations automatically:

```csharp
using Microsoft.EntityFrameworkCore;

// Add this after builder.Build() and before app.Run()
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate(); // Auto-apply pending migrations
}
```

This way, when the app starts on MonsterASP, it will create/update the database schema automatically.

### 6.3 Manual SQL Script Generation

```bash
cd ElBsata.API
dotnet ef migrations script -o migrate.sql
```

Then execute `migrate.sql` against your MonsterASP database using SSMS or the MonsterASP DB management tool.

---

## 7. Verification Checklist

After deployment, verify each item:

### Backend (MonsterASP)
- [ ] Swagger UI loads at `https://elbsata-api.monsterasp.net/swagger`
- [ ] `GET /api/menu` returns menu items
- [ ] `POST /api/auth/login` returns a JWT token with admin credentials
- [ ] `GET /api/orders` (with auth header) returns orders
- [ ] `POST /api/order` successfully submits a test order
- [ ] Database tables are created (Orders, MenuItems, etc.)

### Frontend (Netlify)
- [ ] Site loads at Netlify URL
- [ ] Menu items display correctly
- [ ] Add to cart works
- [ ] Submit order works (the request reaches MonsterASP)
- [ ] Admin login works
- [ ] Admin dashboard shows orders
- [ ] Order details preview works (the bug fix we applied)
- [ ] GPS map links work for orders with coordinates
- [ ] All images load (from `resourceUrl`)

### Integration
- [ ] No CORS errors in browser console
- [ ] API calls from Netlify reach MonsterASP successfully
- [ ] Email preview in admin dashboard shows HTML content

---

## 8. Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| **Blank page on Netlify** | Missing `_redirects` file or wrong path | Ensure `_redirects` exists in `browser/` and has the correct syntax |
| **API calls return 404** | Wrong `apiUrl` in `environment.prod.ts` | Update to `https://elbsata-api.monsterasp.net/api` (no trailing slash) |
| **CORS error in console** | MonsterASP CORS policy doesn't include Netlify URL | Update `Program.cs` CORS policy and redeploy |
| **500 error on API** | Missing environment variable | Check all variables are set in MonsterASP dashboard |
| **Database errors** | Connection string wrong or DB not migrated | Verify connection string format and run migrations |
| **Swagger not loading** | App not started or wrong URL | Make sure the app is running and accessible at `/swagger` |
| **Email not sending** | SMTP settings wrong | Verify `Smtp__Host`, `Port`, `User`, `Pass` in MonsterASP env vars |
| **Login not working** | JWT key mismatch | Ensure `JwtSettings__Key` is set and matches between environments |
| **Images not loading** | Wrong `resourceUrl` | Update `environment.prod.ts` `resourceUrl` to MonsterASP URL |
| **Angular build fails on Netlify** | Node version mismatch | Set Node version in Netlify: `NODE_VERSION=20` in environment variables |

### Debugging on Netlify

Enable Netlify deploy logs:

1. Go to Netlify dashboard → **Deploys**
2. Click on the latest deploy
3. View the build log for any errors

### Debugging on MonsterASP

1. MonsterASP control panel → **Error Logs** or **Event Viewer**
2. Look for application errors, file not found, or database connection errors
3. If the app crashes, check the Windows Event Log if MonsterASP provides access

### Quick API Health Check

From your browser or terminal:

```bash
# Test API is alive
curl https://elbsata-api.monsterasp.net/api/menu

# Test with JWT auth
TOKEN=$(curl -s -X POST https://elbsata-api.monsterasp.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' | jq -r '.token')

curl -H "Authorization: Bearer $TOKEN" \
  https://elbsata-api.monsterasp.net/api/orders
```

---

## Quick Reference — Commands Summary

```bash
# === BACKEND (MonsterASP) ===

# Build
cd ElBsata.API
dotnet publish -c Release -o ./publish

# Upload via FTP → MonsterASP root directory

# === FRONTEND (Netlify) ===

# 1. Update environment.prod.ts with your MonsterASP URL

# 2. Add _redirects to angular.json assets

# 3. Build
cd el-bsata-angular
npm install
ng build --configuration production

# 4. Deploy via Netlify Drop (drag dist/el-bsata-angular/browser/)
#    OR
#    npx netlify-cli deploy --prod --dir=dist/el-bsata-angular/browser/
#    OR connect GitHub repo in Netlify dashboard
```

---

**Ready to deploy?** Make sure your GitHub repo is up to date first:
```bash
git add -A
git commit -m "chore: update env and add Netlify _redirects"
git push origin master