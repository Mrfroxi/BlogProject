# 🏗️ Enterprise Blog Engine

A highly decoupled, testable RESTful API for a blogging platform built with **Node.js** and **TypeScript**. This project serves as a reference implementation for **Clean Architecture** in Node.js, utilizing **InversifyJS** for Dependency Injection and Inversion of Control (IoC).

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Security](#-security--session-management)

---

## 🏛️ Architectural Overview

The system is designed following **SOLID principles** to ensure long-term maintainability and ease of testing.

### Core Design Patterns

| Pattern | Description |
|---------|-------------|
| **Inversion of Control (IoC)** | Managed via InversifyJS to decouple high-level modules from low-level implementations |
| **Layered Architecture** | Controller → Service → Repository separation for clean boundaries |
| **CQS (Command Query Separation)** | Methods separated into state-mutating commands and data-returning queries |
| **Middleware-Driven Security** | Granular access control via custom decorators and Express middleware |
| **Repository Pattern** | Abstracts data persistence (Mongoose), enabling easy data source swaps |

---

## ✨ Features

### **Core Functionality**
- ✅ Blog management (CRUD operations)
- ✅ Post management with pagination and sorting
- ✅ Comment system for posts
- ✅ User registration and authentication
- ✅ Profile management

### **Advanced Features**
- ✅ **Like/Dislike System** for posts and comments
  - Real-time like counters
  - `newestLikes` tracking (top 3 recent likes)
  - User-specific like status (`myStatus`)
- ✅ **Session Management**
  - Device tracking
  - Remote session revocation
  - Security devices audit
- ✅ **Rate Limiting** for brute-force protection
- ✅ **Email Confirmation** for new users
- ✅ **Password Recovery** flow

---

## 🛠️ Technical Stack

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Runtime** | Node.js (LTS) | High-throughput asynchronous I/O |
| **Language** | TypeScript 5.9 | Strict typing for enterprise-grade stability |
| **Framework** | Express 5 | Minimalist core with customized middleware pipeline |
| **Database** | MongoDB 9+ | Document-oriented storage for flexible content schemas |
| **ODM** | Mongoose 9.2 | Schema-based modeling with validation |
| **DI Container** | InversifyJS | True IoC container with singleton/transient scopes |
| **Auth** | JWT & Bcrypt | Stateless authentication with secure password hashing |
| **Testing** | Jest & Supertest | E2E and Unit testing with 100% database isolation |
| **Validation** | express-validator | Request validation middleware |
| **Package Manager** | pnpm | Efficient dependency management |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS version recommended)
- **MongoDB** (local or cloud instance)
- **pnpm** package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BlogProject

# Install dependencies
pnpm install

# Build and watch for development
pnpm run ts-watch

# Start development server
pnpm run dev
```

## 🧪 Testing

The project utilizes **MongoDB Memory Server** for E2E tests, ensuring that the local or production database remains untouched during the CI/CD pipeline.

```bash
# Run all E2E test suites
pnpm run test

# Run specific domain tests (e.g., Like Logic)
pnpm run test -- --testNamePattern="Posts likes"

# Run comment like tests
pnpm run test -- --testNamePattern="Comment Likes"
```

### Test Coverage

- ✅ **Post Likes** - Full like/dislike system for posts
- ✅ **Comment Likes** - Full like/dislike system for comments
- ✅ **Authentication** - Login, registration, token refresh
- ✅ **Blog Management** - CRUD operations
- ✅ **Post Management** - CRUD operations
- ✅ **Comment Management** - CRUD operations
- ✅ **Security Devices** - Session management


## 🔐 Security & Session Management

### **Dual-Token Strategy**

| Token Type | Lifetime | Storage | Purpose |
|------------|----------|---------|---------|
| **Access Token** | Short (JWT) | Authorization Header | API authentication |
| **Refresh Token** | Long | HttpOnly Cookie | Token renewal |

### **Device Tracking**

Each login session is bound to a `DeviceId`. Users can:
- Audit active sessions via `/security/devices`
- Perform remote logouts (Revocation List pattern)
- Delete specific devices or all except current

### **Rate Limiting**

Protects sensitive endpoints against brute-force attacks:
- `/auth/login` - Limited attempts per minute
- `/auth/registration` - Prevents spam registrations

---