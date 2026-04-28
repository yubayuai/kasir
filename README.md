# 🏥 RS Delta Surya - Medical Billing System

A modern, high-performance web-application designed for hospital cashier and marketing teams. Built with **Laravel 12**, **React**, and **Tailwind CSS 4.0**, this system provides a seamless experience for managing medical procedures, insurance discounts, and financial reporting.

---

## 💎 Core Experience

- **Live Summary Billing**: Real-time price calculations with insurance and voucher integration.
- **Role-Specific Dashboards**:
    - **Marketing**: Data-driven insights with interactive charts (Revenue trends & Insurance distribution).
    - **Cashier**: Optimized workflow for high-volume transaction handling.
- **Smart Voucher System**: Configurable rules for various insurance providers (Reliance, Allianz, Prudential).
- **Automated Reporting**: Daily Excel exports delivered via background tasks.
- **Audit Ready**: Every critical data change is logged automatically.

---

## 🛠️ Technology Highlights

- **Backend**: PHP 8.5 + Laravel 12 (Service-oriented architecture).
- **Frontend**: Inertia.js + React (SPA feel with server-side routing).
- **Visualization**: Recharts for elegant, interactive data analysis.
- **Design**: Glassmorphism aesthetic with Framer Motion animations.

---

## 🚀 Quick Start Guide

### 1. Preparation
Ensure you have **PHP 8.5**, **Composer**, and **Node.js** installed.

### 2. Setup
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### 3. Initialize Data
Configure your database in `.env`, then run:
```bash
php artisan migrate --seed
php artisan db:seed --class=BriefingVoucherSeeder
php artisan db:seed --class=SampleDataSeeder
```

### 4. Configure External API
Update these variables in your `.env` to connect with the RS Delta Surya API:
```env
API_DELTA_SURYA_BASE_URL=https://recruitment.rsdeltasurya.com/api/v1
API_DELTA_SURYA_EMAIL=your-email@example.com
API_DELTA_SURYA_PASSWORD=081234567890 # Your phone number format

# Optional: Telegram reporting
TELEGRAM_WEBHOOK_URL=https://cutt.ly/interview-report
```

### 5. Launch
```bash
npm run dev
php artisan serve
```

---

## 🔐 Access Credentials

| Team | Email | Password |
|---|---|---|
| **Marketing** | marketing@rsdeltasurya.com | password |
| **Cashier** | kasir@rsdeltasurya.com | password |

---

## 📬 Background Tasks
Daily reports are handled via Laravel's scheduler. To test manually:
```bash
php artisan schedule:run
```

---

Developed for the **RS Delta Surya** technical assessment.