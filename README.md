# SimpleLMS - Simple Learning Management System

A modern, type-safe LMS microservice built with NestJS, PostgreSQL, and Prisma ORM. Features JWT authentication, RESTful APIs, and comprehensive Swagger documentation.

## 🎯 Project Overview

SimpleLMS is a microservice demonstration showcasing best practices in backend development. It implements a complete learning management system with:

- **User Management** with role-based access (Student, Instructor, Admin)
- **Course Management** with instructor assignment
- **Learning Materials** with multiple content types (Video, PDF, Quiz, Document)
- **JWT Authentication** for secure API access
- **Comprehensive Swagger/OpenAPI Documentation**

## 🏗️ Architecture & Design Patterns

### Modular Architecture

The project follows NestJS's modular architecture pattern, where each feature is encapsulated in its own module:

```
src/
├── auth/           # Authentication module (JWT)
├── user/           # User management module
├── course/         # Course management module
├── material/       # Learning materials module
└── prisma/         # Database module (Prisma)
```

**Why Modular Architecture?**
- **Encapsulation**: Each module contains its own controllers, services, and logic
- **Scalability**: Easy to split into microservices if needed
- **Maintainability**: Clear boundaries between features
- **Testability**: Each module can be tested independently

### Repository Pattern

Each module implements the Repository Pattern to separate data access from business logic:

```
Module Structure:
├── dto/            # Data Transfer Objects (validation)
├── *.repository.ts # Data access layer (Prisma queries)
├── *.service.ts    # Business logic layer
├── *.controller.ts # HTTP layer (routes)
└── *.module.ts     # Dependency injection
```

**Why Repository Pattern?**
- **Separation of Concerns (SoC)**: Database logic is isolated from business logic
- **Flexibility**: Easy to swap databases or add caching (e.g., Redis) without touching business logic
- **Testability**: Services can be unit tested with mocked repositories
- **Code Reusability**: Repository methods can be reused across services

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | TypeScript framework for building scalable server-side applications |
| **PostgreSQL** | Relational database (production-ready SQL database) |
| **Prisma** | Modern ORM with type-safety and auto-completion |
| **Passport-JWT** | Authentication middleware with JSON Web Tokens |
| **class-validator** | DTO validation with decorators |
| **Swagger/OpenAPI** | Interactive API documentation |
| **bcrypt** | Password hashing algorithm |

## 📊 Database Schema

```
┌─────────────┐         ┌──────────────┐         ┌───────────────┐
│    User     │         │   Course     │         │   Material    │
├─────────────┤         ├──────────────┤         ├───────────────┤
│ id          │────┐    │ id           │────┐    │ id            │
│ email       │    │    │ title        │    │    │ title         │
│ password    │    │    │ description  │    │    │ content       │
│ name        │    │    │ instructorId │◄───┘    │ type          │
│ role        │    └───►│ createdAt    │         │ order         │
│ createdAt   │         │ updatedAt    │         │ courseId      │────┐
│ updatedAt   │         └──────────────┘         │ createdAt     │    │
└─────────────┘                │                 │ updatedAt     │    │
                               │                 └───────────────┘    │
                               │                         ▲            │
                               └─────────────────────────┘            │
                                   (One-to-Many)                      │
                                                                      │
                  ┌───────────────────────────────────────────────────┘
                  └► (One-to-Many)
```

### Relationships

- **User → Course**: One-to-Many (One instructor can have many courses)
- **Course → Material**: One-to-Many (One course can have many materials)

### Enums

- **UserRole**: `STUDENT`, `INSTRUCTOR`, `ADMIN`
- **MaterialType**: `VIDEO`, `PDF`, `QUIZ`, `DOCUMENT`

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)

### Installation

1. **Clone the repository**
   ```bash
   cd simplelms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `.env` file with your PostgreSQL credentials:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Update with your PostgreSQL credentials
   DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/simplelms?schema=public
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Setup database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # (Optional) Open Prisma Studio to view database
   npx prisma studio
   ```

5. **Run the application**
   ```bash
   # Development mode with hot-reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the application**
   - **API Base URL**: `http://localhost:3000`
   - **Swagger Documentation**: `http://localhost:3000/api` 📚

## 📖 API Documentation

### Interactive Documentation

Visit `http://localhost:3000/api` for interactive Swagger UI where you can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate with JWT tokens

### API Endpoints Overview

#### Authentication (Public)
```
POST /auth/register   # Register a new user
POST /auth/login      # Login and receive JWT token
```

#### Users (Protected)
```
GET    /users         # Get all users
GET    /users/me      # Get current user profile
GET    /users/:id     # Get user by ID
POST   /users         # Create new user
PATCH  /users/:id     # Update user
DELETE /users/:id     # Delete user
```

#### Courses
```
GET    /courses            # Get all courses (Public)
GET    /courses/:id        # Get course with materials (Public)
POST   /courses            # Create course (Protected)
PATCH  /courses/:id        # Update course (Protected)
DELETE /courses/:id        # Delete course (Protected)
```

#### Materials
```
GET    /materials                  # Get all materials (Public)
GET    /materials?courseId=<id>   # Filter by course (Public)
GET    /materials/:id              # Get material by ID (Public)
POST   /materials                  # Create material (Protected)
PATCH  /materials/:id              # Update material (Protected)
DELETE /materials/:id              # Delete material (Protected)
```

> **🔒 Protected**: Requires JWT token in Authorization header as Bearer token

### Authentication Flow

1. **Register** a new user:
   ```bash
   POST /auth/register
   {
     "email": "instructor@example.com",
     "password": "SecurePass123",
     "name": "John Doe",
     "role": "INSTRUCTOR"
   }
   ```

2. **Response** includes JWT token:
   ```json
   {
     "user": { ... },
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

3. **Use token** for protected endpoints:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🧪 Testing

### E2E Testing (Coming Soon)

Run end-to-end tests:
```bash
npm run test:e2e
```

Test coverage includes:
- ✅ Authentication flow (register → login → token validation)
- ✅ Protected endpoint authorization (401 tests)
- ✅ CRUD operations for all entities
- ✅ Course-Material relationship validation
- ✅ Invalid courseId error handling

### Manual Testing

Use **Postman** or **Swagger UI** (`/api`) to test endpoints manually.

## 🎓 Key Features Demonstration

### 1. **Type Safety** (Prisma + TypeScript)
   - Auto-completion for database queries
   - Compile-time type checking
   - Generated types from Prisma schema

### 2. **Validation** (class-validator)
   - Automatic DTO validation
   - Clear error messages
   - Email format, UUID validation, etc.

### 3. **Security** (JWT + Passport)
   - Stateless authentication
   - Protected routes with Guards
   - Password hashing with bcrypt

### 4. **Documentation** (Swagger)
   - Auto-generated from decorators
   - Interactive testing interface
   - Clear request/response examples

## 🔧 Development Scripts

```bash
# Development
npm run start          # Start application
npm run start:dev      # Start with watch mode (hot-reload)
npm run start:debug    # Start in debug mode

# Build
npm run build          # Build for production

# Code Quality
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Test coverage report
npm run test:e2e       # Run E2E tests

# Database
npx prisma studio      # Open database GUI
npx prisma migrate dev # Create new migration
npx prisma generate    # Generate Prisma Client
```

## 📁 Project Structure

```
simplelms/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── user/                  # User module
│   │   ├── dto/
│   │   ├── user.repository.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   └── user.module.ts
│   ├── course/                # Course module
│   │   ├── dto/
│   │   ├── course.repository.ts
│   │   ├── course.service.ts
│   │   ├── course.controller.ts
│   │   └── course.module.ts
│   ├── material/              # Material module
│   │   ├── dto/
│   │   ├── material.repository.ts
│   │   ├── material.service.ts
│   │   ├── material.controller.ts
│   │   └── material.module.ts
│   ├── prisma/                # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
├── test/
│   └── app.e2e-spec.ts        # E2E tests
├── .env                        # Environment variables
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production

Update `.env` for production:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<your-production-database-url>
JWT_SECRET=<strong-random-secret-256-bits>
JWT_EXPIRES_IN=7d
```

### Build and Run

```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

This project is a demonstration of best practices. Key principles followed:

1. **SOLID Principles**
2. **Clean Architecture**
3. **Type Safety**
4. **Comprehensive Validation**
5. **Clear Documentation**
6. **Separation of Concerns**

## 📝 License

UNLICENSED - This is a demonstration project.

---

**Built with ❤️ using NestJS, Prisma, and PostgreSQL**

For questions or improvements, please open an issue or submit a pull request!
