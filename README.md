# GearGuard - The Ultimate Maintenance Tracker

A complete, enterprise-grade MERN stack application for managing equipment maintenance, teams, and service requests.

## 🎯 Overview

GearGuard is a full-featured maintenance tracking system that helps organizations:
- Track equipment and assets
- Manage maintenance teams
- Handle corrective and preventive maintenance requests
- Visualize work with Kanban boards
- Schedule preventive maintenance with calendar views
- Monitor equipment history and status

## 🏗️ Architecture

```
GearGuard/
├── Server/          # Node.js + Express + MongoDB Backend
└── Client/          # React + Material-UI Frontend
```

### Backend (Server/)
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication
- RESTful API architecture
- Role-based access control

### Frontend (Client/)
- **React 18** with **Vite**
- **Material-UI** component library
- **FullCalendar** for scheduling
- **@dnd-kit** for Kanban drag-and-drop
- **Axios** for API communication

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Four user roles: ADMIN, MANAGER, TECHNICIAN, EMPLOYEE
- Role-based route protection
- Automatic token management

### 🛠️ Equipment Management
- Complete CRUD operations
- Equipment tracking by department and location
- Warranty and purchase date tracking
- Equipment status (ACTIVE/SCRAPPED)
- Smart maintenance button with request count badge
- Full maintenance history per equipment

### 👥 Team Management
- Create specialized maintenance teams (IT, Mechanical, Electrical, HVAC, General)
- Assign technicians to teams
- Team-based request filtering
- Technician roster management

### 📋 Maintenance Requests

#### Request Types
- **CORRECTIVE**: Breakdown/repair requests
- **PREVENTIVE**: Scheduled maintenance

#### Request Lifecycle
```
NEW → IN_PROGRESS → REPAIRED → SCRAP
```

#### Smart Features
- **Auto-fill maintenance team** from equipment selection
- Mandatory scheduled date for preventive requests
- Hours tracking
- Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
- Notes and status updates
- Equipment-wise request history

### 📊 Kanban Board (Technician View)
- Drag-and-drop task management
- Four status columns
- Visual overdue indicators (red border)
- Technician avatar display
- Real-time status updates via API
- Team-filtered view

### 📅 Calendar View
- FullCalendar integration
- View all scheduled preventive maintenance
- Click date to create preventive request
- Color-coded by status
- Month and week views
- Event click to view details

### 🎨 Dashboard
- Role-based quick actions
- Statistics overview
- Equipment, request, and team counts
- Pending request tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd GearGuard
```

### 2. Setup Backend

```bash
cd Server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd Client
npm install
cp .env.example .env
# Edit .env if needed (default: http://localhost:5000/api)
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Access Application

Open `http://localhost:3000` in your browser.

## 📖 Documentation

- [Server README](./Server/README.md) - Backend API documentation
- [Client README](./Client/README.md) - Frontend documentation

## 🔄 Workflows

### Corrective Maintenance Flow

1. **Employee** creates breakdown request
2. Selects equipment → Maintenance team **auto-assigned**
3. **Manager** assigns technician from team
4. **Technician** views in Kanban board
5. Drags card: NEW → IN_PROGRESS
6. Completes work, logs hours
7. Drags to REPAIRED

### Preventive Maintenance Flow

1. **Manager** opens Calendar view
2. Clicks future date
3. Creates preventive request (scheduled date mandatory)
4. Selects equipment → Team auto-assigned
5. Assigns technician
6. **Technician** sees in Calendar and Kanban
7. Completes on scheduled date

### Equipment Scrap Flow

1. Request status changed to SCRAP
2. Equipment automatically marked as SCRAPPED
3. Equipment history preserved
4. No new requests allowed for scrapped equipment

## 🎭 User Roles & Permissions

| Feature | ADMIN | MANAGER | TECHNICIAN | EMPLOYEE |
|---------|-------|---------|------------|----------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| Create Equipment | ✅ | ✅ | ❌ | ❌ |
| Delete Equipment | ✅ | ❌ | ❌ | ❌ |
| Create Team | ✅ | ✅ | ❌ | ❌ |
| Delete Team | ✅ | ❌ | ❌ | ❌ |
| Create Request | ✅ | ✅ | ✅ | ✅ |
| Assign Technician | ✅ | ✅ | ❌ | ❌ |
| Update Request | ✅ | ✅ | ✅* | ❌ |
| Kanban Board | ✅ | ✅ | ✅ | ❌ |
| Calendar View | ✅ | ✅ | ✅ | ✅ |

*Technicians can only update requests assigned to them or their team

## 🛡️ Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API routes
- Input validation on all endpoints
- MongoDB injection protection
- CORS configuration
- Automatic token expiration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/:id` - Get equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `PATCH /api/equipment/:id/scrap` - Mark as scrapped

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team
- `PUT /api/teams/:id` - Update team
- `POST /api/teams/:id/technicians` - Add technician
- `DELETE /api/teams/:id/technicians/:technicianId` - Remove technician

### Requests
- `GET /api/requests` - List requests
- `POST /api/requests` - Create request
- `GET /api/requests/:id` - Get request
- `PATCH /api/requests/:id/status` - Update status
- `PATCH /api/requests/:id/assign` - Assign technician
- `GET /api/requests/equipment/:equipmentId` - Get by equipment
- `GET /api/requests/calendar` - Calendar view

## 🧪 Testing

### Manual Testing Flow

1. **Register users** with different roles
2. **Create maintenance teams** (as Admin/Manager)
3. **Add equipment** and assign to teams
4. **Create requests** and test auto-fill
5. **Use Kanban board** to drag and drop
6. **Schedule preventive maintenance** via calendar
7. **Test role-based access** by logging in as different users

### Sample Test Data

```javascript
// Admin User
{
  name: "Admin User",
  email: "admin@gearguard.com",
  password: "admin123",
  role: "ADMIN",
  department: "Management"
}

// Technician User
{
  name: "John Technician",
  email: "tech@gearguard.com",
  password: "tech123",
  role: "TECHNICIAN",
  department: "IT"
}
```

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas
4. Set up PM2 process manager
5. Configure nginx reverse proxy
6. Enable HTTPS

### Frontend
1. Build: `npm run build`
2. Serve `dist/` folder
3. Configure environment variables
4. Set up CDN (optional)

## 🤝 Contributing

This is an enterprise-grade implementation. Follow these guidelines:

- Maintain clean separation between Client and Server
- Follow existing code patterns
- Add validation for all inputs
- Document new features
- Test role-based access
- Preserve business logic rules

## 📝 Business Rules

### Auto-Fill Logic
- Equipment selection → Maintenance team auto-assigned
- Request status defaults to NEW
- Completed date auto-set when status → REPAIRED

### State Transitions
- NEW → [IN_PROGRESS, SCRAP]
- IN_PROGRESS → [REPAIRED, SCRAP]
- REPAIRED → [SCRAP]
- SCRAP → [] (terminal state)

### Validation Rules
- Preventive requests MUST have scheduled date
- Equipment must be ACTIVE to create requests
- Technician must belong to team to be assigned
- Only team members can update team requests

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` configuration
- Check port 5000 is available

### Frontend can't connect to backend
- Verify backend is running
- Check `VITE_API_URL` in Client/.env
- Check CORS configuration

### Authentication issues
- Clear localStorage
- Verify JWT_SECRET matches
- Check token expiration

## 📄 License

ISC

## 🙏 Acknowledgments

Built with modern MERN stack best practices for enterprise maintenance tracking.

---

**GearGuard - Keeping Your Equipment Running Smoothly** ⚙️
