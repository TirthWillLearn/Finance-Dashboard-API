# Finance Dashboard Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

**A backend API for a finance dashboard system with role-based access control.**  
Users manage financial records based on their role — Viewer, Analyst, or Admin.  
Built with a focus on clean architecture, access control, and aggregated data APIs.

[GitHub](https://github.com/TirthWillLearn/Finance-Dashboard)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Role Based Access Control](#role-based-access-control)
- [Key Engineering Decisions](#key-engineering-decisions)
- [Assumptions Made](#assumptions-made)
- [Author](#author)

---

## Overview

This API serves as the backend for a finance dashboard where different users interact with financial records based on their assigned role. It supports full CRUD operations on financial records, JWT-based authentication, role-enforced access control, and summary-level analytics endpoints designed to power a frontend dashboard.

---

## Features

### Authentication & Access Control
- JWT-based authentication (register, login)
- Three roles — `viewer`, `analyst`, `admin` — enforced via middleware
- Passwords hashed using bcrypt (10 salt rounds)
- Token carries `id` and `role` — decoded by auth middleware on every protected request

### Financial Records Management
- Create, read, update, delete financial records
- Dynamic filtering by `category` and `type` via query parameters
- Each record linked to the user who owns it via `user_id` foreign key

### Dashboard Summary APIs
- Total income, total expenses, net balance
- Category-wise totals using `GROUP BY`
- Monthly trends using `EXTRACT(MONTH/YEAR FROM date)` with `GROUP BY`

### Validation & Error Handling
- Proper HTTP status codes throughout (`200`, `201`, `400`, `401`, `403`, `500`)
- Try/catch on all controllers with meaningful error messages
- Role check returns `403` — auth failure returns `401`

---

## Tech Stack

| Layer          | Technology     |
| -------------- | -------------- |
| Runtime        | Node.js 18     |
| Framework      | Express.js     |
| Language       | TypeScript     |
| Database       | PostgreSQL 15  |
| Authentication | JWT + bcrypt   |

---

## Project Structure

```
src/
├── index.ts                        # Express server entry point
├── config/
│   └── db.ts                       # PostgreSQL connection pool
├── types/
│   └── index.ts                    # TypeScript interfaces (User, FinancialRecord)
├── services/
│   ├── user.service.ts             # createUser, getUserByEmail, loginUser
│   ├── record.service.ts           # CRUD + dynamic filtering for financial records
│   └── dashboard.service.ts        # Summary, category totals, monthly trends
├── controllers/
│   ├── auth.controller.ts          # register, login
│   ├── record.controller.ts        # create, getAll, update, remove
│   └── dashboard.controller.ts     # summary, category, monthly
├── routes/
│   ├── auth.routes.ts              # /api/auth
│   ├── record.routes.ts            # /api/records
│   └── dashboard.routes.ts         # /api/dashboard
└── middlewares/
    └── auth.middleware.ts          # authMiddleware + roleMiddleware
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/TirthWillLearn/Finance-Dashboard.git
cd Finance-Dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your database credentials and JWT secret.

### 4. Create database tables

Run `schema.sql` against your PostgreSQL database:

```bash
psql -U postgres -d your_db_name -f schema.sql
```

Or copy and run the contents of `schema.sql` directly in pgAdmin.

### 5. Start the development server

```bash
npm run dev
```

Server runs at `http://localhost:4242`

---

## Environment Variables

```ini
PORT=4242

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=your_jwt_secret
```

> Never commit your `.env` file. Use `.env.example` as a reference.

---

## Database Schema

### ENUM Types

```sql
CREATE TYPE user_role AS ENUM ('viewer', 'analyst', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE record_type AS ENUM ('income', 'expense');
```

### Users Table

| Column     | Type         | Notes                        |
| ---------- | ------------ | ---------------------------- |
| id         | SERIAL       | Primary key                  |
| name       | VARCHAR(100) |                              |
| email      | VARCHAR(100) | Unique                       |
| password   | VARCHAR(255) | bcrypt hashed                |
| role       | user_role    | viewer / analyst / admin     |
| status     | user_status  | Default: active              |
| created_at | TIMESTAMP    | Default: NOW()               |
| updated_at | TIMESTAMP    | Default: NOW()               |

### Financial Records Table

| Column     | Type         | Notes                        |
| ---------- | ------------ | ---------------------------- |
| id         | SERIAL       | Primary key                  |
| user_id    | INTEGER      | Foreign key → users.id       |
| amount     | FLOAT8       |                              |
| type       | record_type  | income / expense             |
| category   | VARCHAR(50)  |                              |
| date       | DATE         |                              |
| notes      | VARCHAR(100) |                              |
| created_at | TIMESTAMP    | Default: NOW()               |
| updated_at | TIMESTAMP    | Default: NOW()               |

---

## API Reference

### Authentication

| Method | Endpoint              | Access | Description           |
| ------ | --------------------- | ------ | --------------------- |
| POST   | `/api/auth/register`  | Public | Register a new user   |
| POST   | `/api/auth/login`     | Public | Login and receive JWT |

### Financial Records

| Method | Endpoint             | Access              | Description                        |
| ------ | -------------------- | ------------------- | ---------------------------------- |
| POST   | `/api/records`       | Admin only          | Create a financial record          |
| GET    | `/api/records`       | Viewer/Analyst/Admin| Get all records (supports filters) |
| PUT    | `/api/records/:id`   | Admin only          | Update a record                    |
| DELETE | `/api/records/:id`   | Admin only          | Delete a record                    |

**Query Parameters for GET /api/records:**
- `?category=salary` — filter by category
- `?type=income` — filter by type (income / expense)
- `?category=food&type=expense` — combine filters

### Dashboard

| Method | Endpoint                   | Access              | Description              |
| ------ | -------------------------- | ------------------- | ------------------------ |
| GET    | `/api/dashboard/summary`   | Viewer/Analyst/Admin| Total income, expenses, net balance |
| GET    | `/api/dashboard/category`  | Viewer/Analyst/Admin| Totals grouped by category |
| GET    | `/api/dashboard/monthly`   | Viewer/Analyst/Admin| Income and expenses by month |

---

### Example: Register

**POST** `/api/auth/register`

```json
{
  "name": "Tirth Patel",
  "email": "tirth@example.com",
  "password": "123456",
  "role": "admin"
}
```

```json
{
  "message": "User created",
  "user": {
    "id": 1,
    "name": "Tirth Patel",
    "email": "tirth@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

---

### Example: Create Record

**POST** `/api/records` — `Authorization: Bearer <token>`

```json
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

```json
{
  "message": "Records created Successfully",
  "records": {
    "id": 1,
    "user_id": 1,
    "amount": 50000,
    "type": "income",
    "category": "salary",
    "date": "2026-04-01",
    "notes": "April salary"
  }
}
```

---

### Example: Dashboard Summary

**GET** `/api/dashboard/summary` — `Authorization: Bearer <token>`

```json
{
  "message": "Records Summary!",
  "dashboard": {
    "total_income": 50000,
    "total_expenses": 20000,
    "net_balance": 30000
  }
}
```

---

### Example: Monthly Trends

**GET** `/api/dashboard/monthly` — `Authorization: Bearer <token>`

```json
{
  "message": "Records Monthly Trends!",
  "dashboard": [
    {
      "month": "4",
      "year": "2026",
      "income": 50000,
      "expenses": 20000
    }
  ]
}
```

---

## Role Based Access Control

| Action                  | Viewer | Analyst | Admin |
| ----------------------- | ------ | ------- | ----- |
| View financial records  | ✅     | ✅      | ✅    |
| View dashboard summary  | ✅     | ✅      | ✅    |
| Create financial record | ❌     | ❌      | ✅    |
| Update financial record | ❌     | ❌      | ✅    |
| Delete financial record | ❌     | ❌      | ✅    |

Roles are enforced via `roleMiddleware` — a factory function that accepts an array of allowed roles and returns a middleware. The role is extracted from the JWT token payload on every request.

---

## Key Engineering Decisions

**Why store role directly in the users table instead of a separate roles table?**  
This system has three fixed roles that never change. Role behavior is enforced entirely in middleware logic — not stored as data. A separate roles table would add unnecessary complexity without any benefit for this use case.

**Why use PostgreSQL ENUMs for role and status?**  
ENUMs restrict column values at the database level. If invalid values are attempted (e.g. `role = 'superuser'`), PostgreSQL rejects them automatically — providing a second layer of validation beyond the application layer.

**Why dynamic query building for filtering and updates?**  
Filters (category, type) and update fields are all optional. Hardcoding all combinations would require many separate queries. Building the SQL string dynamically with a positional counter (`$1`, `$2`...) keeps the logic in one place and handles any combination of inputs cleanly.

**Why attach user_id from JWT instead of request body?**  
Accepting `user_id` from the request body is a security risk — any user could claim to be someone else. Instead, `user_id` is decoded from the verified JWT token in `authMiddleware` and attached to `req.body`. Controllers never trust the client for identity.

**Why separate services and controllers?**  
Controllers handle only request/response logic. All business logic and database queries live in services. This separation makes the code easier to test, maintain, and reason about.

---

## Assumptions Made

- A user can only access their own financial records (filtered by `user_id` from JWT)
- `updated_at` is not automatically updated on record changes — this can be added with a PostgreSQL trigger or handled in the update service
- No pagination implemented — can be added to `getRecords` using `LIMIT` and `OFFSET`
- Authentication uses Bearer token in the `Authorization` header for all protected routes

---

## Author

**Tirth Patel** — Backend Developer

[![GitHub](https://img.shields.io/badge/GitHub-TirthWillLearn-181717?style=flat-square&logo=github)](https://github.com/TirthWillLearn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-tirth--k--patel-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/tirth-k-patel/)
[![Portfolio](https://img.shields.io/badge/Portfolio-tirthdev.in-111111?style=flat-square&logo=firefox)](https://tirthdev.in)
