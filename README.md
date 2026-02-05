# SimpleLMS - Simple Learning Management System

A modern, type-safe LMS microservice built with NestJS, PostgreSQL (Supabase), and Prisma ORM. Features JWT authentication, fine-grained RBAC with policy-based authorization, **file upload with Supabase Storage**, RESTful APIs, and comprehensive Swagger documentation.

## 🎯 Project Overview

SimpleLMS is a microservice demonstration showcasing best practices in backend development. It implements a complete learning management system with:

- **User Management** with role-based access (Student, Instructor, Admin)
- **Fine-Grained Authorization** with resource ownership policies
- **Course Management** with instructor ownership
- **Learning Materials** with multiple content types (Video, PDF, Quiz, Document)
- **File Upload** for materials (PDF, videos, documents) with Supabase Storage
- **JWT Authentication** for secure API access
- **Policy-Based Access Control** (users update own profiles, instructors manage own courses)
- **Comprehensive Swagger/OpenAPI Documentation**

## 🏗️ Architecture & Design Patterns

### Modular Architecture

The project follows NestJS's modular architecture pattern, where each feature is encapsulated in its own module:

```
src/
├── auth/           # Authentication module (JWT + Guards + Policies)
├── user/           # User management module
├── course/         # Course management module
├── material/       # Learning materials module (with file upload)
├── storage/        # Supabase Storage service for file uploads
├── common/         # Shared policies and utilities
│   └── policies/   # Authorization policies (UserPolicy, CoursePolicy, MaterialPolicy)
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
├── *.controller.ts # HTTP layer (routes + authorization)
└── *.module.ts     # Dependency injection

Authorization Structure:
├── guards/         # Authentication & authorization guards
├── decorators/     # Custom decorators (@Roles, @CheckPolicy)
├── strategies/     # Passport strategies (JWT)
└── policies/       # Fine-grained authorization policies
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
| **PostgreSQL** | Relational database (hosted on Supabase) |
| **Supabase** | Backend-as-a-Service for PostgreSQL hosting, pooling, and storage |
| **Supabase Storage** | Cloud file storage with CDN for learning materials |
| **Prisma** | Modern ORM with type-safety and auto-completion |
| **Passport-JWT** | Authentication middleware with JSON Web Tokens |
| **Multer** | Middleware for handling multipart/form-data file uploads |
| **class-validator** | DTO validation with decorators |
| **class-transformer** | Transform objects for validation (e.g., string to number) |
| **Swagger/OpenAPI** | Interactive API documentation |
| **bcrypt** | Password hashing algorithm |
| **Policy Guards** | Custom fine-grained authorization with resource ownership |

## 📊 Database Schema

```
┌─────────────┐         ┌──────────────┐         ┌───────────────┐
│    User     │         │   Course     │         │   Material    │
├─────────────┤         ├──────────────┤         ├───────────────┤
│ id          │────┐    │ id           │────┐    │ id            │
│ email       │    │    │ title        │    │    │ title         │
│ password    │    │    │ description  │    │    │ content       │ (optional)
│ name        │    │    │ instructorId │◄───┘    │ fileUrl       │ (optional)
│ role        │    └───►│ createdAt    │         │ type          │
│ createdAt   │         │ updatedAt    │         │ order         │
│ updatedAt   │         └──────────────┘         │ courseId      │────┐
└─────────────┘                │                 │ createdAt     │    │
                               │                 │ updatedAt     │    │
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
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))
- **Supabase CLI** (optional, for migrations)

### Installation

1. **Clone the repository**
   ```bash
   cd simplelms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase Database**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Get your connection string from **Project Settings → Database**
   
   c. Use the **Transaction pooler** connection string (port 6543)

4. **Configure environment variables**
   
   Edit `.env` file with your Supabase credentials:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Supabase PostgreSQL Connection (Transaction Pooler)
   # IMPORTANT: Add ?pgbouncer=true for pooler compatibility
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Supabase Storage (for file uploads)
   # Get these from: Supabase Dashboard → Project Settings → API
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SERVICE_KEY="your-service-role-key-here"
   ```
   
   > ⚠️ **Important**: 
   > - The `?pgbouncer=true` parameter is required to disable prepared statements for Supabase's transaction pooler.
   > - Use the **service_role** key (SECRET) for `SUPABASE_SERVICE_KEY`, NOT the anon public key.

5. **Setup database schema**
   
   **Option A: Using Supabase CLI (Recommended)**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   npx supabase login
   
   # Link your project
   npx supabase link --project-ref YOUR_PROJECT_ID
   
   # Generate migration from Prisma schema
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > supabase/migrations/init.sql
   
   # Push to Supabase
   npx supabase db push
   
   # Generate Prisma Client
   npx prisma generate
   ```
   
   **Option B: Using Prisma Migrate (Direct Connection)**
   ```bash
   # Temporarily use direct connection (port 5432)
   # Update DATABASE_URL in .env to direct connection
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Switch back to pooler connection with ?pgbouncer=true
   ```

6. **Setup Supabase Storage (for file uploads)**
   
   a. Go to Supabase Dashboard → **Storage**
   
   b. Create a new bucket:
      - Name: `materials`
      - Public: **Yes** (allow public read access)
   
   c. (Optional) Configure bucket policies for security:
      ```sql
      -- Allow authenticated users to upload
      CREATE POLICY "Allow uploads for authenticated users"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'materials');
      
      -- Allow public read access
      CREATE POLICY "Allow public read access"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'materials');
      ```

7. **Run the application**
   ```bash
   # Development mode with hot-reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

8. **Access Swagger UI**
   
   Open your browser: **http://localhost:3000/api**
   
9. **Test with Swagger**
   - Register a new user via `/auth/register`
   - Copy the JWT token from response
   - Click "Authorize" button in Swagger UI
   - Paste token (without "Bearer" prefix)
   - Test protected endpoints

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

#### Users (Fine-Grained Authorization)
```
GET    /users         # Get all users (Admin & Instructor)
GET    /users/me      # Get current user profile (Own)
GET    /users/:id     # Get user by ID (Admin or Own)
POST   /users         # Create new user (Admin Only)
PATCH  /users/:id     # Update user (Admin or Own Profile)
DELETE /users/:id     # Delete user (Admin Only, Cannot Delete Self)
```

#### Courses (Resource Ownership)
```
GET    /courses            # Get all courses (Public)
GET    /courses/:id        # Get course with materials (Public)
POST   /courses            # Create course (Admin Only)
PATCH  /courses/:id        # Update course (Admin or Instructor Owner)
DELETE /courses/:id        # Delete course (Admin or Instructor Owner)
```

#### Materials (Course Ownership)
```
GET    /materials                  # Get all materials (Public)
GET    /materials?courseId=<id>    # Filter by course (Public)
GET    /materials/:id              # Get material by ID (Public)
POST   /materials                  # Create text-only material (Admin & Instructor)
POST   /materials/upload           # Upload file for material (Admin & Instructor)
PATCH  /materials/:id              # Update material (Admin or Course Instruct`or)
DELETE /materials/:id              # Delete material + file (Admin or Course Instructor)
```

**File Upload Example:**

```bash
curl -X 'POST' \
  'http://localhost:3000/materials/upload' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@lecture.pdf;type=application/pdf' \
  -F 'title=Week 1 Lecture Notes' \
  -F 'courseId=9aae48c6-0412-4496-89cc-e692f2ad2fe5' \
  -F 'type=PDF' \
  -F 'order=1' \
  -F 'content=Optional text description'
```

**Supported File Types:**
- **VIDEO**: mp4, webm, mkv, mov (max 50MB)
- **PDF**: application/pdf (max 50MB)
- **DOCUMENT**: pdf, doc, docx, txt (max 50MB)
- **QUIZ**: json, txt (max 50MB)

**Material Fields:**
- `content` and `fileUrl` are **both optional** - materials can have:
  - Text only (`content` without file)
  - File only (`fileUrl` without content)
  - Both text and file
  - Auto-deletion: files are deleted from Supabase Storage when material is deleted

### 🔐 Authorization Matrix

| Operation | Admin | Instructor | Student/User |
|-----------|-------|------------|-------------|
| **Users** |
| Create user | ✅ | ❌ | ❌ |
| View all users | ✅ | ✅ | ❌ |
| View user | ✅ Any | ❌ | ✅ Own |
| Update user | ✅ Any | ❌ | ✅ Own |
| Delete user | ✅ Any (not self) | ❌ | ❌ |
| **Courses** |
| View courses | ✅ | ✅ | ✅ (Public) |
| Create course | ✅ | ❌ | ❌ |
| Update course | ✅ Any | ✅ Own | ❌ |
| Delete course | ✅ Any | ✅ Own | ❌ |
| **Materials** |
| View materials | ✅ | ✅ | ✅ (Public) |
| Create material | ✅ | ✅ | ❌ |
| Update material | ✅ Any | ✅ Own course | ❌ |
| Delete material | ✅ Any | ✅ Own course | ❌ |

> **🔒 Protected**: Requires JWT token in Authorization header as Bearer token  
> **✅ Own**: User can only access their own resources  
> **✅ Own course**: Instructor can only manage materials for courses they teach

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

### 3. **Security** (JWT + Passport + Policies)
   - Stateless authentication
   - Protected routes with Guards
   - **Fine-grained authorization with policies**
   - **Resource ownership validation**
   - Password hashing with bcrypt

### 4. **Policy-Based Access Control**
   - **BasePolicy**: Common authorization helpers
   - **UserPolicy**: Users update own profiles
   - **CoursePolicy**: Instructors manage own courses
   - **MaterialPolicy**: Instructors manage own course materials
   - **PolicyGuard**: Dynamic resource loading and authorization

### 5. **Documentation** (Swagger)
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

# Supabase
npx supabase login     # Login to Supabase
npx supabase db push   # Push migrations to Supabase
```

## 🛡️ Authorization & Policies

### How It Works

SimpleLMS implements **fine-grained authorization** using custom policies:

1. **PolicyGuard** - Intercepts requests and checks permissions
2. **@CheckPolicy() decorator** - Declarative policy enforcement
3. **Policy classes** - Define authorization rules

### Example: Instructor Can Only Update Own Courses

```typescript
// course.policy.ts
canUpdate(currentUser: User, course: Course): boolean {
    return this.isAdmin(currentUser) || 
           (this.isInstructor(currentUser) && course.instructorId === currentUser.id);
}

// course.controller.ts
@Patch(':id')
@UseGuards(JwtAuthGuard, PolicyGuard)
@CheckPolicy('canUpdate', CoursePolicy)
update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
}
```

**What happens:**
1. Request comes in with JWT token
2. `PolicyGuard` loads the course from database
3. Checks if `currentUser.id === course.instructorId` OR user is admin
4. Returns 403 if unauthorized

## 🐛 Troubleshooting

### Common Issues

#### 1. **Error: "prepared statement s0 already exists"**

**Cause**: Using Supabase transaction pooler (port 6543) without `pgbouncer=true`

**Solution**: Add `?pgbouncer=true` to your DATABASE_URL:
```env
DATABASE_URL="postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Restart the application after updating `.env`.

#### 2. **Error: "User not authenticated" on protected endpoints**

**Cause**: Missing or invalid JWT token

**Solution**:
- Make sure you registered/logged in first
- Copy the `access_token` from login response
- In Swagger UI: Click "Authorize" and paste token (without "Bearer" prefix)
- For Postman: Add header `Authorization: Bearer YOUR_TOKEN`

#### 3. **403 Forbidden even with valid token**

**Cause**: Insufficient permissions or trying to access others' resources

**Solution**: Check authorization matrix in this README:
- Students cannot create/update/delete courses
- Instructors can only update/delete their own courses
- Regular users can only update their own profile

#### 4. **Database connection errors**

**Solutions**:
- Verify DATABASE_URL is correct in `.env`
- Check if Supabase project is active
- Ensure you're using the correct port (6543 for pooler, 5432 for direct)
- Verify network/firewall allows connections

#### 5. **Migration issues**

**Solutions**:
- For Supabase: Use `supabase db push` instead of `prisma migrate`
- For direct connection: Run `npx prisma migrate deploy`
- Always run `npx prisma generate` after schema changes
```

### 📁 Project Structure

```text
simplelms/
├─ prisma/
│  └─ schema.prisma              # Database schema
├─ src/
│  ├─ auth/                      # Authentication module
│  │  ├─ dto/
│  │  ├─ guards/                 # JwtAuthGuard, PolicyGuard
│  │  ├─ decorators/             # @Roles, @CheckPolicy
│  │  ├─ strategies/             # JWT strategy
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  └─ auth.module.ts
│  ├─ common/                    # Shared utilities
│  │  └─ policies/               # Authorization policies
│  │     ├─ base.policy.ts
│  │     ├─ user.policy.ts
│  │     ├─ course.policy.ts
│  │     ├─ material.policy.ts
│  │     └─ index.ts
│  ├─ user/                      # User module
│  │  ├─ dto/
│  │  ├─ user.repository.ts
│  │  ├─ user.service.ts
│  │  ├─ user.controller.ts
│  │  └─ user.module.ts
│  ├─ course/                    # Course module
│  │  ├─ dto/
│  │  ├─ course.repository.ts
│  │  ├─ course.service.ts
│  │  ├─ course.controller.ts
│  │  └─ course.module.ts
│  ├─ material/                  # Material module (file upload)
│  │  ├─ dto/
│  │  ├─ material.repository.ts
│  │  ├─ material.service.ts
│  │  ├─ material.controller.ts
│  │  └─ material.module.ts
│  ├─ storage/                   # Supabase Storage module
│  │  ├─ storage.service.ts      # File upload/deletion
│  │  └─ storage.module.ts
│  ├─ prisma/                    # Prisma module
│  │  ├─ prisma.service.ts
│  │  └─ prisma.module.ts
│  ├─ app.module.ts              # Root module
│  └─ main.ts                    # Application entry
├─ test/
│  └─ app.e2e-spec.ts            # E2E tests
├─ supabase/
│  └─ migrations/                # Database migrations
├─ .env                          # Environment variables
├─ package.json
└─ README.md
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
