# Event Booking System - Backend Architecture

## Overview
This is a production-ready monolithic Node.js backend for an Event Booking System. It supports two user roles: **Organizers** (who create and manage events) and **Customers** (who browse events and book tickets). 

## Architecture & Design Decisions

### 1. Layered Architecture (Clean Architecture)

```mermaid
graph TD
    Client[Client App / Postman] --> API[API Layer Routes & Controllers]
    
    subgraph Backend Monolith
        API --> Validator[Zod Validation]
        Validator --> API
        API --> Service[Service Layer Business Logic]
        Service --> Prisma[Data Access Layer Prisma ORM]
        Service -.-> Queue[In-Memory Event Queue]
        Queue --> Worker[Email Worker]
    end
    
    Prisma --> DB[(PostgreSQL Neon)]
    Worker --> Email[External Email Nodemailer]
```

The application follows a strictly layered monolithic structure as per senior engineering best practices:
- **API Layer (`src/api`)**: Responsible only for HTTP concerns. Contains express `routes`, `controllers`, `middlewares`, and Zod `validators`.
- **Service Layer (`src/services`)**: Contains all core business logic and transaction management. Services are completely decoupled from HTTP request/response objects, making them highly testable.
- **Data Access Layer (`prisma/`)**: Uses Prisma ORM for database interactions. Prisma provides type safety, automatic migrations, and built-in connection pooling suitable for PostgreSQL.
- **Jobs Layer (`src/jobs`)**: An event-driven, non-blocking **In-Memory Queue** (using Node.js `EventEmitter` and `setImmediate`) isolates long-running background tasks (like sending emails) from the main API thread without requiring external dependencies like Redis.

### 2. Database Choice
**PostgreSQL (via Neon)** was chosen because strict ACID compliance is mandatory for an event booking system to prevent overselling tickets.

### 3. Concurrency Strategy (Optimistic Version Locking)
**The Problem**: Multiple customers attempting to book the last available ticket concurrently could lead to a race condition (overselling).
**The Solution**: We implemented **Optimistic Concurrency Control (OCC)**. 
- The `events` table contains a `version` integer column.
- During a booking, the system fetches the current `version`, verifies `availableSeats`, and attempts an atomic update: 
  `UPDATE events SET availableSeats = ..., version = version + 1 WHERE id = ? AND version = ?`.
- If the version doesn't match (meaning another transaction updated it), Prisma throws an error, and the booking service automatically retries the operation up to 3 times before failing cleanly.

### 4. Background Processing & Caching
Sending emails synchronously during a HTTP request is a severe anti-pattern as it blocks the thread and slows down response times.
- **Message Queue**: We utilize a lightweight, high-performance **In-Memory Queue** driven by Node's native `EventEmitter` and `setImmediate`.
  - **Job 1**: Booking Confirmations are pushed to the queue immediately after a booking is secured in the DB.
  - **Job 2**: Event Updates trigger a job that fetches all related customers and dispatches emails concurrently.
  - Both use **Nodemailer** to send Gmail. If no Gmail credentials are provided in `.env`, the Email Service will automatically mock the email output to the console for easy local testing.
- **In-Memory Caching**: We utilize **node-cache** to cache the list of events and individual event details in RAM. This drastically reduces database read queries. The cache is automatically invalidated whenever an event is updated or a new booking is made.

### 5. Security & Validation
- **Authentication**: JWT-based stateless authentication.
- **Role-Based Access Control (RBAC)**: An `auth.middleware.js` strictly restricts route access (`protect` and `restrictTo('ORGANIZER')`). Roles are modeled as integers (`1: CUSTOMER`, `2: ORGANIZER`) in the database for speed, but mapped to strings in the JWT for readability.
- **Input Validation**: All incoming requests are strictly validated using **Zod** before hitting the controllers. This prevents malformed data and NoSQL/SQL injection patterns.

## Getting Started

### Prerequisites
1. Node.js (v18+)
2. PostgreSQL Database (Neon)

### Installation
```bash
npm install
npx prisma db push
npx prisma generate
```

### Environment Variables
Create a `.env` file with the following:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@host/db"
JWT_SECRET=super-secret-key
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### Running the Server
```bash
npm run dev
```
