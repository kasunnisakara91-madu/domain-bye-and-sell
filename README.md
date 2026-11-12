# DOMAIN SELL — Production-Ready Domain, API & WhatsApp Bot Marketplace

[![Android Build APK](https://github.com/actions/workflows/android-build.yml/badge.svg)](.github/workflows/android-build.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)
![Theme: Dark Neon](https://img.shields.io/badge/Theme-Black%20%2B%20Neon%20Violet-8B5CF6.svg)

**DOMAIN SELL** is a full-stack digital asset commerce platform consisting of a responsive React + TypeScript website, a Node.js Express REST API backend with MongoDB, a secure administrative manual product unlock pipeline, and a native Android APK equipped with an interactive **Neon Particles Live Wallpaper**.

---

## 🌟 Key Architectural Features

1. **Brand Identity & Premium Design**:
   - Ultra-luxury Dark Theme: Deep Black (`#080511`) + Neon Violet (`#8B5CF6`) + Cyber Pink (`#EC4899`).
   - Dynamic Glassmorphism UI with real-time glowing canvas particle constellation background.
   - Android Live Wallpaper (`NeonParticlesWallpaperService`) with smooth touch ripples and moving cosmic gradient.
2. **Customer Access (Zero-Friction & Anti-Hijacking)**:
   - Unique username system — no complicated passwords or third-party OAuth lock-in.
   - Secure 4-digit master PIN prevents other users from claiming an existing username.
3. **Domain Store with Registry Verification**:
   - Real-time DNS root server verification before order confirmation — never falsely claims domain availability.
   - Categories: `.com`, `.lk`, `.net`, `.org`, `.site`, `.online`, `.xyz`, and Custom Domains.
4. **API Marketplace**:
   - Categories: WhatsApp APIs, AI APIs, Movie APIs, Music APIs, Social Media APIs, Image APIs, Video APIs, and Custom APIs.
   - Interactive endpoint documentation and live sandbox query simulator.
5. **WhatsApp Mini Bot Store**:
   - Automated business bots for E-Commerce stores, Tuition class portals, Salons, and Lead capture.
   - Official WhatsApp click-to-chat integration (`https://wa.me/...`).
6. **Bank Payment System (No Credit Cards)**:
   - Display administrator bank details with a 1-click **Copy Account Number** button.
   - Bank transfer slip upload (JPG, PNG, WEBP, PDF) with secure server-side file access control.
   - Pre-filled WhatsApp payment notification generator.
7. **Manual Domain Unlock System (Step 9)**:
   - Orders never unlock automatically.
   - Administrator validates the bank transfer independently, audits the slip, and clicks **Authorize & Unlock**.
   - Domains, DNS records, API keys, and bot tokens appear immediately inside the customer's **My Products** portal.
8. **Configurable Pricing (`config/pricing.json`)**:
   - Easily modify all product rates, bank details, and admin WhatsApp numbers without modifying frontend code.

---

## 📁 Repository Structure

```
DOMAIN-SELL/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ParticleBackground, OrderModal, ReceiptModal
│   │   ├── pages/                # Home, Domains, APIs, Bots, Orders, Products, Payment, Contact, About, Admin
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/                      # Node.js + Express + Mongoose REST API
│   ├── models/                   # Customer, Domain, APIProduct, BotProduct, Order, Payment, Receipt, Admin, ActivityLog, Settings
│   ├── controllers/              # domainController, apiController, botController, orderController, paymentController, customerController, adminController
│   ├── middleware/               # auth.js (JWT), upload.js (Multer filetype security)
│   ├── routes/                   # REST API routes
│   ├── seed.js                   # Database initialization script
│   ├── server.js                 # Express server entry point
│   └── package.json
├── app/                          # Native Android Kotlin + Jetpack Compose Project
│   ├── src/main/java/com/example/
│   │   ├── wallpaper/            # NeonParticlesWallpaperService (Android Live Wallpaper)
│   │   ├── data/                 # Models & DomainSellRepository
│   │   ├── ui/                   # Jetpack Compose UI (Screens, Theme, Components)
│   │   └── MainActivity.kt
│   └── build.gradle.kts
├── config/
│   └── pricing.json              # Centralized marketplace pricing, bank details & WhatsApp config
├── uploads/
│   └── receipts/                 # Secure customer bank slips
├── .github/
│   └── workflows/
│       └── android-build.yml     # Automated APK compilation & artifact upload
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Backend & Database Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas connection string)

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your settings:
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/domainsell
JWT_SECRET=your_super_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@DomainSell2026!
ADMIN_PIN=2026

# Administrator Receiving Bank Account
BANK_NAME=Commercial Bank of Ceylon / Bank of Ceylon
ACCOUNT_HOLDER=DOMAIN SELL (PVT) LTD
ACCOUNT_NUMBER=801294819203
BRANCH=Colombo City Office

# Administrator WhatsApp
ADMIN_WHATSAPP_NUMBER=94771234567
```

### 2. Install Dependencies & Seed Database
```bash
# In backend/
cd backend
npm install
node seed.js
```
The seed script populates default verified domains, APIs, WhatsApp bots, global bank settings, and the administrator account.

### 3. Start Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

---

## 🌐 Frontend Website Setup

```bash
cd frontend
npm install
npm run dev
# Website runs on http://localhost:3000 (proxies /api to http://localhost:5000)
```

To create a production static build:
```bash
npm run build
```

---

## 📱 Android APK Build Instructions

The Android application is built with **Kotlin 2.0+** and **Jetpack Compose (Material 3)**.

### Build Debug APK locally
```bash
# Build the APK directly via Gradle
gradle assembleDebug
```
The resulting APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

### Setting the Live Wallpaper on Android
1. Open the DOMAIN SELL app on your Android device.
2. Tap the **Set Live Wallpaper** button on the Home screen or in Settings.
3. The system Wallpaper Preview screen will appear showcasing the interactive glowing purple particles.
4. Tap **Set Wallpaper** (Home Screen or Home & Lock Screen).

---

## 🤖 GitHub Actions Workflow

The repository includes `.github/workflows/android-build.yml` configured to:
1. Check out the codebase.
2. Set up Java JDK 17.
3. Configure the Android SDK command-line tools.
4. Run `gradle assembleDebug`.
5. Upload the built `.apk` file as an automated downloadable GitHub Actions artifact.

---

## 🔐 Administrator Setup & Workflow

1. Open the Admin Panel (`/admin` on website or tap **Admin** on the Android app).
2. Enter default username: `admin` and Password: `Admin@DomainSell2026!` or Master PIN: `2026`.
3. **Workflow for Customer Orders**:
   - **Step 1**: Customer selects domain and places an order with their username.
   - **Step 2**: Customer transfers money to the administrator's bank account.
   - **Step 3**: Customer uploads the bank transfer slip.
   - **Step 4**: Admin opens **Payment Verification**, inspects the slip, and clicks **Approve**.
   - **Step 5**: Admin switches to **Domain Unlock System** and clicks **Authorize & Unlock**.
   - **Step 6**: The domain DNS records and registration credentials appear instantaneously in the customer's **My Products** dashboard.

---

## 📄 License
MIT License. Built for high-trust digital asset commerce.
