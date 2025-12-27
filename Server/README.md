# GearGuard Backend API

Enterprise-grade MERN backend for the GearGuard Maintenance Tracker application.

## 🏗️ Architecture

This backend follows a clean, layered MVC architecture:

```
Server/
├── config/          # Database and JWT configuration
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API route definitions
├── middleware/      # Auth, role-based access, error handling
├── utils/           # Helper functions and validators
└── server.js        # Application entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd Server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the Server directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Private |

### Equipment (`/api/equipment`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create equipment | Admin, Manager |
| GET | `/` | Get all equipment | All authenticated |
| GET | `/:id` | Get equipment by ID | All authenticated |
| PUT | `/:id` | Update equipment | Admin, Manager |
| DELETE | `/:id` | Delete equipment | Admin only |
| PATCH | `/:id/scrap` | Mark as scrapped | Admin, Manager |

### Maintenance Teams (`/api/teams`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create team | Admin, Manager |
| GET | `/` | Get all teams | All authenticated |
| GET | `/:id` | Get team by ID | All authenticated |
| PUT | `/:id` | Update team | Admin, Manager |
| POST | `/:id/technicians` | Add technician | Admin, Manager |
| DELETE | `/:id/technicians/:technicianId` | Remove technician | Admin, Manager |
| DELETE | `/:id` | Delete team | Admin only |

### Maintenance Requests (`/api/requests`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create request | All authenticated |
| GET | `/` | Get all requests | Role-filtered |
| GET | `/calendar` | Get calendar view | Role-filtered |
| GET | `/equipment/:equipmentId` | Get by equipment | All authenticated |
| GET | `/:id` | Get request by ID | Team-filtered |
| PATCH | `/:id/status` | Update status | Team members |
| PATCH | `/:id/assign` | Assign technician | Admin, Manager |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles & Permissions

### ADMIN
- Full access to all resources
- Can delete equipment and teams
- Can manage all users

### MANAGER
- Create and manage equipment
- Create and manage teams
- Assign technicians to requests
- View all requests

### TECHNICIAN
- View requests assigned to them or their team
- Update status of assigned requests
- Log hours and add notes

### EMPLOYEE
- Create maintenance requests
- View their own requests
- View equipment

## 🔄 Request Lifecycle

### Corrective (Breakdown) Flow

1. **NEW** → Any user creates a request
2. **IN_PROGRESS** → Manager/Admin assigns technician
3. **REPAIRED** → Technician completes work and logs hours
4. **SCRAP** → Equipment marked unusable (optional)

### Preventive Flow

1. Manager creates request with **scheduled date** (mandatory)
2. System auto-assigns maintenance team from equipment
3. Manager assigns specific technician
4. Technician completes on scheduled date

### State Transition Rules

```
NEW → [IN_PROGRESS, SCRAP]
IN_PROGRESS → [REPAIRED, SCRAP]
REPAIRED → [SCRAP]
SCRAP → [] (terminal state)
```

## 🧪 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "MANAGER",
    "department": "IT"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Equipment (requires token):**
```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Industrial Printer",
    "serialNumber": "IP-2024-001",
    "purchaseDate": "2024-01-15",
    "warrantyExpiry": "2026-01-15",
    "location": "Building A, Floor 2",
    "department": "IT",
    "assignedEmployee": "USER_ID",
    "maintenanceTeam": "TEAM_ID"
  }'
```

## 🏗️ Data Models

### User
- name, email, password (hashed)
- role: ADMIN | MANAGER | TECHNICIAN | EMPLOYEE
- department
- maintenanceTeam (ref)

### Equipment
- name, serialNumber, purchaseDate, warrantyExpiry
- location, department
- assignedEmployee (ref), maintenanceTeam (ref)
- status: ACTIVE | SCRAPPED

### MaintenanceTeam
- name, description
- specialization: MECHANICAL | ELECTRICAL | IT | HVAC | GENERAL
- technicians[] (refs)
- isActive

### MaintenanceRequest
- subject, description
- equipment (ref), maintenanceTeam (ref)
- assignedTechnician (ref), createdBy (ref)
- requestType: CORRECTIVE | PREVENTIVE
- status: NEW | IN_PROGRESS | REPAIRED | SCRAP
- scheduledDate, completedDate, hoursSpent
- priority: LOW | MEDIUM | HIGH | CRITICAL

## 🛡️ Security Features

- Password hashing with bcrypt (12 rounds)
- JWT-based stateless authentication
- Role-based access control (RBAC)
- Input validation on all routes
- MongoDB injection protection
- CORS enabled for frontend integration

## 📝 Business Logic

### Auto-Fill Rules
- When equipment is selected, maintenance team is auto-assigned
- Request status defaults to NEW
- Completed date auto-set when status → REPAIRED

### Access Control
- Technicians can only view/modify requests for their team
- Managers can assign any technician from the request's team
- Only Admins can delete equipment and teams

### Validation
- Preventive requests MUST have scheduled date
- State transitions are validated
- Equipment must be ACTIVE to create requests
- Technician must belong to maintenance team to be assigned

## 🐛 Error Handling

The API uses centralized error handling with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 📦 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Enable HTTPS
5. Set up process manager (PM2)
6. Configure reverse proxy (nginx)

## 🤝 Contributing

This is an enterprise backend implementation. Follow these guidelines:

- Maintain layered architecture
- Add validation for all inputs
- Document new endpoints
- Follow existing code patterns
- Test all state transitions

## 📄 License

ISC

---

**Built with ❤️ for GearGuard - The Ultimate Maintenance Tracker**
