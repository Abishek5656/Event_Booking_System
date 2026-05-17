---
description: Project Setup
---

# Production-Grade Monolithic Backend Architecture (Node.js + Express.js)

You are a senior Staff Software Engineer and System Designer with experience building large-scale production systems at companies like Apple and Google.

Design a **production-grade monolithic backend architecture** using **Node.js + Express.js**.

The goal is to create a backend structure that is:

- Scalable
- Maintainable
- Modular
- Enterprise-ready
- Easy for large teams to collaborate on
- Suitable for long-term production systems

---

# Requirements

## Include the Following

### 1. Folder Structure

- Complete production-level folder structure
- Organized using feature/module-based architecture
- Suitable for monolithic applications

### 2. Explain Each Folder

Explain:

- Why it exists
- What responsibility it has
- What should and should not go inside it

### 3. Architecture Principles

Cover:

- Separation of concerns
- Clean architecture concepts
- Layered architecture
- Dependency flow
- Modular boundaries

### 4. Enterprise Patterns

Include patterns such as:

- Service Layer
- Repository Pattern
- DTO Pattern
- Middleware Pattern
- Factory Pattern
- Dependency Injection (if needed)

### 5. Configuration Management

Explain:

- Environment handling
- Config loading
- Secrets management
- Multi-environment setup

### 6. Logging & Monitoring

Include:

- Centralized logging
- Request tracing
- Error logging
- Monitoring strategy

### 7. Error Handling

Design:

- Global error handling
- Custom error classes
- Async error wrappers
- API error response format

### 8. Authentication & Authorization

Explain structure for:

- JWT authentication
- Role-based access control (RBAC)
- Permission handling
- Auth middleware

### 9. Database Layer

Show organization for:

- Models
- Schemas
- Repositories
- Migrations
- Seeders
- Transactions

### 10. Validation Layer

Explain:

- Request validation
- DTO validation
- Schema validation
- Input sanitization

### 11. Middleware Structure

Include:

- Authentication middleware
- Validation middleware
- Rate limiting
- Security middleware
- Request logging

### 12. Service vs Repository Layer

Clearly explain:

- Responsibilities
- Data flow
- Business logic placement
- Common mistakes

### 13. API Versioning

Design:

- API versioning strategy
- Backward compatibility handling

### 14. Background Jobs / Queues

Structure support for:

- BullMQ / RabbitMQ
- Workers
- Retry handling
- Scheduled jobs

### 15. Testing Strategy

Include:

- Unit testing
- Integration testing
- E2E testing
- Mocking strategy
- Test folder structure

### 16. Shared Utilities

Organize:

- Constants
- Helpers
- Utilities
- Common services
- Shared types/interfaces

### 17. Security Best Practices

Cover:

- Helmet
- CORS
- Rate limiting
- Input sanitization
- SQL/NoSQL injection prevention
- Secure headers

### 18. Scalability Considerations

Explain:

- How this monolith can scale
- Modular scaling
- Future migration path to microservices

---

# Additional Requirements

Also explain:

- Why this architecture works in real-world production systems
- Trade-offs compared to microservices
- Common mistakes developers make in Node.js backend architecture
- How large engineering teams structure monolithic backends internally

---

# Deliverables

Provide:

1. Production-ready folder structure
2. Detailed explanation of every layer
3. Example request lifecycle/flow
4. Best practices used by senior backend engineers
5. Real-world engineering insights
6. Common anti-patterns to avoid

---

# Tech Stack

- Node.js
- Express.js
- MongoDB or PostgreSQL
- JWT Authentication
- Redis
- BullMQ or RabbitMQ
- Docker-ready
- REST API

---

# Expectations

The answer should:

- Be deeply practical
- Reflect real-world production engineering
- Avoid overly theoretical explanations
- Focus on scalability and maintainability
- Teach from first principles
- Include clean and understandable examples
- Be beginner-friendly but production-level
