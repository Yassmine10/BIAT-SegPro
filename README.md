# BIAT SegPro – Intelligent Customer Segmentation Platform for Retail Banking

BIAT SegPro is a production-ready, intelligent customer segmentation platform built for **BIAT (Banque Internationale Arabe de Tunisie)**. Designed for Retail Banking Analysts, it establishes a modular, secure, and extensible MVC foundation for rule-based and AI-driven clustering models.

---

## 🚀 Quick Start (Docker Compose)

The entire ecosystem is containerized and can be launched with a single command. 

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/)

### Launching the Application
Run the following command at the root of the project:

```bash
docker-compose up --build
```

This starts:
1. **PostgreSQL Database** on port `5432` (with automatic health check configuration).
2. **FastAPI Backend** on port `8000` (with auto-seeding of database schemas & admin/analyst users).
3. **Next.js 15 Frontend** on port `3000` (development server with hot reload).

### Default Logins for Testing
When the backend container boots up, it automatically seeds the database with the following accounts:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@biat.com.tn` | `admin1234` |
| **Retail Banking Analyst** | `analyst@biat.com.tn` | `analyst1234` |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, Client & Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Curated banking colors)
- **Forms & Validation:** React Hook Form & Zod
- **API Client:** Axios (With automatic interceptors for token routing)
- **Icons:** Lucide React

### Backend
- **Framework:** Python, FastAPI
- **ORM:** SQLAlchemy (Declarative Base 2.0 Mapping)
- **Migrations:** Alembic (Pre-configured structure)
- **Validation:** Pydantic v2
- **Security:** JWT (python-jose), Password Encryption (Direct Bcrypt for Python 3.13 stability)

### Database
- **Engine:** PostgreSQL 15

---

## 📁 Project Structure

BIAT SegPro follows a strict MVC design pattern to isolate routing, business logic, data persistence, and UI rendering.

```text
BIAT SegPro/
├── docker-compose.yml             # Container Orchestration
├── README.md                      # Platform Documentation
├── backend/                       # Python FastAPI Application
│   ├── Dockerfile                 # Slim Linux Python 3.13 image build
│   ├── requirements.txt           # Python backend dependencies
│   ├── .env                       # Local environment variables
│   └── app/
│       ├── config/                # BaseSettings configuration
│       ├── database/              # SQLAlchemy session and engine instantiation
│       ├── models/                # Database schemas (SQLAlchemy models)
│       ├── schemas/               # Request/Response DTO validators (Pydantic v2)
│       ├── repositories/          # Direct DB CRUD operations (Repository Pattern)
│       ├── services/              # Business logic & validations (Service layer)
│       ├── controllers/           # API Routers & routes definitions
│       ├── utils/                 # Security utilities (Bcrypt & JWT tokens)
│       └── main.py                # FastAPI bootstrapper, CORS, and Lifespan seeder
│
└── frontend/                      # Next.js 15 Client Application
    ├── Dockerfile                 # Node Alpine developer image build
    ├── package.json               # Frontend dependencies list
    ├── tsconfig.json              # TypeScript compilation rules
    ├── postcss.config.mjs         # Tailwind processor
    └── src/
        ├── app/                   # App Router (login, dashboard, pages)
        ├── components/            # Reusable UI components
        ├── context/               # Global Authentication State context (AuthProvider)
        ├── hooks/                 # Reusable React hooks
        ├── services/              # Axios instance configuration & auth API services
        ├── types/                 # TypeScript typings
        └── middleware.ts          # Server-side routing guard checking token cookies
```

---

## 🔌 REST API Reference

The backend exposes fully validated OpenAPI endpoints. Once the containers are running, you can access the interactive documentation at:
👉 **[http://localhost:8000/api/docs](http://localhost:8000/api/docs) (Swagger)**  
👉 **[http://localhost:8000/api/redoc](http://localhost:8000/api/redoc) (ReDoc)**

### Authentication Endpoints

#### `POST /api/auth/login`
Authenticates user credentials and sets up a session.
- **Request Body:**
  ```json
  {
    "email": "analyst@biat.com.tn",
    "password": "analyst1234"
  }
  ```
- **Response (200 OK):** Returns token details, user role, and user profile metadata.

#### `POST /api/auth/logout`
Acknowledges client session termination.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Acknowledges success.

#### `GET /api/auth/me`
Retrieves current logged-in analyst's profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** User details.

---

### User Administration Endpoints

#### `POST /api/users`
Creates a new analyst account.
- **Access Rule:** Restricted to `Administrator` role.
- **Request Body:**
  ```json
  {
    "first_name": "Hamdi",
    "last_name": "Gharbi",
    "email": "hamdi.gharbi@biat.com.tn",
    "password": "securepassword123",
    "role": "Retail Banking Analyst"
  }
  ```
- **Response (201 Created):** Created User details without the password hash.

#### `GET /api/users`
Retrieves list of all platform operators.
- **Access Rule:** Requires authenticated session.
- **Response (200 OK):** Array of User objects.

---

### Health & Support Endpoints

#### `GET /health`
Returns the status of the API instance and database checks.
- **Response (200 OK):** `{"status": "healthy", "service": "BIAT SegPro"}`

---

## 🔒 Security Standards Implemented

1. **JWT Session Management:** Stateless login sessions with automatic 24h token expiry.
2. **Robust Password Hashing:** Uses `bcrypt` hashes to protect credentials in transit/database.
3. **Role-Based Access Control (RBAC):** Restricts admin panels `/api/users` to the `Administrator` role on both frontend (UI components and middleware redirects) and backend (FastAPI security dependencies).
4. **Input Sanitization & Constraints:** All request properties are strictly validated using Pydantic schemas on the backend, and client-side schemas using Zod.
5. **CORS Protocol:** Restricted header & origin permissions for browser clients.
