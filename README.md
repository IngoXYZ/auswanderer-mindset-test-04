# Auswanderer Mindset Test

## 🚀 Vercel Deployment

### 1. GitHub Upload
- Lösche ALLE Dateien in deinem GitHub Repository `auswanderer-mindset-test`
- Lade ALLE Dateien aus diesem ZIP in das Root-Verzeichnis hoch

### 2. Vercel Setup
1. Gehe zu Vercel.com
2. Neue Deployment von GitHub
3. **Root Directory**: `. ` (nicht `app`!)
4. **Build Command**: Standard lassen
5. **Output Directory**: Standard lassen

### 3. Environment Variables in Vercel
```
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

### 4. Database Setup (Neon.tech)
1. Erstelle Account auf neon.tech  
2. Neue PostgreSQL Database
3. Kopiere Connection String
4. Füge in Vercel Environment Variables ein

## ✅ Features
- 15 Quiz-Fragen in Deutsch
- Responsive Design (thesmallreset.org)
- Admin Panel: `/admin`
- Prisma + PostgreSQL
- Production-ready

## 🔧 Lokale Entwicklung
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```
