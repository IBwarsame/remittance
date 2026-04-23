# REMIT — Community Remittance Web App

A full-stack web application that digitises and streamlines informal
community-based remittance operations. Built as a Final Year Project
for BSc (Hons) Software Engineering at the University of Westminster.

> **Note:** This application does not process or hold money. It is a
> coordination and record-keeping platform that replaces WhatsApp-based
> informal transfer management with a structured digital workflow.

---

## The Problem

Many diaspora communities manage money transfers informally through
WhatsApp — no formal records, no way to track a transfer, no structured
process for proof of payment. REMIT solves this by providing a
centralised platform for both the operator and their users.

---

## Features

### For Users
- Register with email verification
- Declare a transfer with a real-time server-side quote (fee + exchange rate)
- View the operator's bank details after declaring a transfer
- Upload proof of payment (JPEG, PNG, WebP — max 5MB)
- Track transfer status in real time via unique reference number (e.g. `TXN-A1B2C3D4`)
- Save recipients for faster future transfers
- Password reset with anti-enumeration protection

### For the Operator (Admin)
- Admin dashboard with analytics and transaction management
- Review uploaded proof of payment
- Confirm funds received / mark transfers as completed
- Update bank details (displayed to users after transfer declaration)
- Export transaction data as CSV
- Generate synthetic demo data for testing/demonstration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (15-min expiry), bcrypt (12 rounds) |
| Email | Nodemailer + Mailtrap (dev) / Resend (production) |
| Charts | Recharts |
| Hosting | Vercel (frontend), Railway (backend) |

---

## Architecture

The application follows a **three-tier architecture**:

Browser → Next.js Frontend → Express REST API → SQLite Database

text

The backend is organised into three layers:
- **Routes** — HTTP concerns, request parsing, response sending
- **Services** — business logic and validation
- **DAOs** — all SQL queries, no business logic

Two databases are used:
- `remittance.db` — live data
- `demo.db` — synthetic data for demonstration (never affects live data)

---

## Transaction Lifecycle

CREATED → AWAITING_FUNDS_CHECK → PAID_IN → COMPLETED
(user declares) (proof uploaded) (admin confirms) (admin marks sent)

text

---

## Security

- bcrypt password hashing at 12 salt rounds
- JWT authentication with 15-minute token expiry
- Rate limiting: 5 login attempts per 15 min, 5 registrations per hour
- Role-based access control (`user` / `admin` / `dev`)
- NIST-aligned password policy (min 12 chars, upper, lower, number, special)
- Randomised file upload filenames (Multer)
- MIME type allowlist for uploads (JPEG, PNG, WebP only)
- Anti-enumeration on password reset
- SQL injection prevention via status/field allowlists

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/IBwarsame/remittance
cd remit
Install backend dependencies:

bash
cd backend
npm install
Install frontend dependencies:

bash
cd ../frontend
npm install
Environment Variables
Create a .env file in the backend/ directory:

text
PORT=3001
JWT_SECRET=your_jwt_secret

# Mailtrap (dev/internal addresses)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass

# Resend (production/real addresses)
RESEND_API_KEY=your_resend_api_key

FRONTEND_URL=http://localhost:3000
Create a .env.local file in the frontend/ directory:

text
NEXT_PUBLIC_API_URL=http://localhost:3001
Running Locally
Start the backend:

bash
cd backend
npm run dev
Start the frontend:

bash
cd frontend
npm run dev
The app will be available at http://localhost:3000.

Deployment
Frontend — deployed on Vercel (auto-deploys
on push to main)
Backend — deployed on Railway (auto-deploys
on push to main)
Note: Railway blocks outbound SMTP on standard ports. The mailer
uses a dual-transport setup — Mailtrap for internal test addresses,
Resend (HTTPS) for all real addresses in production.

Supported Destinations
Country	Currency	Exchange Rate
Somalia	SOS (Somali Shilling)	1 GBP = 34 SOS
Ethiopia	ETB (Ethiopian Birr)	1 GBP = 48.5 ETB
Transfer fee: 2% (fixed, server-side, non-configurable)

Project Structure
text
remit/
├── backend/
│   ├── config/          # DB initialisation
│   ├── daos/            # SQL queries (TransactionDao, UserDao, etc.)
│   ├── middleware/       # auth, rate limiter, role, upload, password policy
│   ├── routes/          # authRoutes, transactionRoutes, adminRoutes, etc.
│   ├── services/        # AuthService, TransactionService, QuoteService, etc.
│   ├── mailer.js        # Dual-transport email setup
│   └── index.js         # Express app entry point
│
└── frontend/
    └── src/
        └── app/
            ├── admin/   # Admin dashboard
            ├── send/    # Send money flow
            ├── transactions/ # Transaction detail & tracking
            ├── login/
            ├── register/
            └── lib/
                └── api.js   # Centralised fetch utility
AUTHOR

Ibrahim Warsame — w19914200
University of Westminster — BSc (Hons) Software Engineering, 2026

DISCLAIMER

This application was built as an academic project. It does not hold, process or transmit money. The operator using this platform is responsible for their own legal and regulatory obligations when facilitating transfers on behalf of others.
