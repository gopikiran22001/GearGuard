# GearGuard - The Ultimate Maintenance Tracker

A complete, production-ready MERN stack application for managing equipment maintenance, teams, and service requests with full backend-frontend integration.

## 🎯 Overview

GearGuard is a full-featured maintenance tracking system that helps organizations:
- Track equipment and assets
- Manage maintenance teams
- Handle corrective and preventive maintenance requests
- Visualize work with Kanban boards
- Schedule preventive maintenance with calendar views
- Monitor equipment history and status

## ✅ Integration Status: PRODUCTION READY

**All frontend features are fully powered by backend APIs** with:
- ✅ Secure JWT authentication using HTTP-only cookies
- ✅ Role-based access control (ADMIN, MANAGER, TECHNICIAN, EMPLOYEE)
- ✅ Real-time data synchronization
- ✅ Comprehensive error handling
- ✅ Toast notifications for user feedback
- ✅ Loading states on all async operations
- ✅ **Zero mock data** - everything uses real backend APIs

---

## 🏗️ Architecture

```
GearGuard/
├── Server/          # Node.js + Express + MongoDB Backend
└── Client/          # Next.js 14 + React 19 + TypeScript Frontend
```

### Backend (Server/)
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication with HTTP-only cookies
- RESTful API architecture
- Role-based access control
- Input validation with express-validator
- Security: Helmet, CORS, Rate Limiting

### Frontend (Client/)
- **Next.js 14** (App Router)
- **React 19** with **TypeScript**
- **Tailwind CSS** + **Shadcn/ui** components
- **Axios** for API communication
- **Sonner** for toast notifications
- **React Context API** for state management

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+) - Local or MongoDB Atlas
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

# Create .env file
cp .env.example .env
```

Edit `Server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd Client
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Access Application

Open `http://localhost:3000` in your browser and register a new account!

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookies (XSS protection)
- Global auth state with `AuthContext`
- Protected routes with `ProtectedRoute` component
- Four user roles: ADMIN, MANAGER, TECHNICIAN, EMPLOYEE
- Automatic session persistence
- Secure logout functionality

### 🛠️ Equipment Management
- Complete CRUD operations with real-time API integration
- Equipment tracking by department and location
- Warranty and purchase date tracking
- Equipment status (ACTIVE/SCRAPPED)
- Filter by department and status
- Loading states and error handling
- Toast notifications for user feedback

### 👥 Team Management
- Create specialized maintenance teams (IT, Mechanical, Electrical, HVAC, General)
- Assign technicians to teams
- Team-based request filtering
- Real-time team statistics (members, open requests, completed)
- Role-based access (ADMIN and MANAGER only)

### 📋 Maintenance Requests

#### Request Types
- **CORRECTIVE**: Breakdown/repair requests
- **PREVENTIVE**: Scheduled maintenance

#### Request Lifecycle
```
NEW → IN_PROGRESS → REPAIRED → SCRAP
```

#### Features
- Kanban board with drag-and-drop status updates
- Create new maintenance requests
- Filter by team, type, and priority
- Calendar view for preventive maintenance
- Technician assignment
- Hours tracking and notes
- Equipment-wise request history

### 📊 Dashboard
- Real-time statistics from all APIs
- Active equipment count
- Team count
- Open and overdue request tracking
- Recent activity feed
- Performance metrics

### 📅 Calendar View
- View all scheduled preventive maintenance
- Click date to create preventive request
- Color-coded by status
- Month and week views
- Real-time data from backend

---

## 🎭 User Roles & Permissions

| Feature | ADMIN | MANAGER | TECHNICIAN | EMPLOYEE |
|---------|-------|---------|------------|----------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| View Equipment | ✅ | ✅ | ✅ | ✅ |
| Create Equipment | ✅ | ✅ | ❌ | ❌ |
| Update Equipment | ✅ | ✅ | ❌ | ❌ |
| Delete Equipment | ✅ | ❌ | ❌ | ❌ |
| View Teams | ✅ | ✅ | ✅ | ✅ |
| Create Teams | ✅ | ✅ | ❌ | ❌ |
| Delete Teams | ✅ | ❌ | ❌ | ❌ |
| View Requests | ✅ | ✅ | ✅ | ✅ |
| Create Requests | ✅ | ✅ | ✅ | ✅ |
| Update Requests | ✅ | ✅ | ✅ | ❌ |
| Assign Technician | ✅ | ✅ | ❌ | ❌ |
| Kanban Board | ✅ | ✅ | ✅ | ❌ |
| Calendar View | ✅ | ✅ | ✅ | ✅ |

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login (sets HTTP-only cookie)
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout (clears cookie)

### Equipment
- `GET /api/equipment` - List equipment (with filters)
- `POST /api/equipment` - Create equipment (ADMIN, MANAGER)
- `GET /api/equipment/:id` - Get equipment details
- `PUT /api/equipment/:id` - Update equipment (ADMIN, MANAGER)
- `DELETE /api/equipment/:id` - Delete equipment (ADMIN)
- `PATCH /api/equipment/:id/scrap` - Mark as scrapped (ADMIN, MANAGER)

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team (ADMIN, MANAGER)
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team (ADMIN, MANAGER)
- `DELETE /api/teams/:id` - Delete team (ADMIN)
- `POST /api/teams/:id/technicians` - Add technician
- `DELETE /api/teams/:id/technicians/:technicianId` - Remove technician

### Requests
- `GET /api/requests` - List requests (with filters)
- `POST /api/requests` - Create request
- `GET /api/requests/:id` - Get request details
- `PATCH /api/requests/:id/status` - Update status
- `PATCH /api/requests/:id/assign` - Assign technician
- `GET /api/requests/equipment/:equipmentId` - Get by equipment
- `GET /api/requests/calendar` - Calendar view (preventive)

---

## 🛡️ Security Features

### Backend Security
- ✅ **HTTP-Only Cookies**: JWT tokens not accessible via JavaScript (XSS protection)
- ✅ **CORS Protection**: Only frontend origin allowed
- ✅ **Rate Limiting**: 100 requests per 15 minutes per IP
- ✅ **Input Validation**: Express-validator on all endpoints
- ✅ **Password Hashing**: bcrypt with 12 rounds
- ✅ **Helmet**: Security headers enabled
- ✅ **Role Middleware**: Enforces permissions on protected routes

### Frontend Security
- ✅ **No Token Storage**: Browser handles cookies automatically
- ✅ **Credentials Included**: `withCredentials: true` on all requests
- ✅ **Protected Routes**: Authentication required for all pages except login/register
- ✅ **Role-Based UI**: Components check user role before rendering

---

## 🔄 Data Flow Architecture

```
User Action (Frontend)
    ↓
API Service Call (lib/api/*.ts)
    ↓
Axios Instance (withCredentials: true)
    ↓
Backend Route (routes/*.js)
    ↓
Auth Middleware (validates JWT from cookie)
    ↓
Role Middleware (checks permissions)
    ↓
Controller (business logic)
    ↓
MongoDB (data persistence)
    ↓
Response (JSON with success/error)
    ↓
Frontend State Update
    ↓
UI Re-render + Toast Notification
```

---

## 🧪 Testing the Integration

### 1. Test Authentication
1. Navigate to `http://localhost:3000/register`
2. Create a new account
3. Verify redirect to dashboard
4. Check that user info displays correctly
5. Test logout functionality

### 2. Test Equipment Management
1. Navigate to Equipment page
2. Create new equipment
3. Verify toast notification
4. Check equipment appears in list
5. Test filters (department, status)

### 3. Test Maintenance Requests
1. Navigate to Requests page
2. Create new request
3. Drag request between columns (status update)
4. Verify backend updates
5. Test calendar view

### 4. Test Teams Management
1. Navigate to Teams page (requires ADMIN/MANAGER role)
2. Create new team
3. Verify team statistics display
4. Check request counts update

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in Server directory
- Check for port conflicts (port 5000)

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `.env.local` has correct API URL
- Clear browser cache and cookies

### CORS errors
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL exactly
- Restart backend server after changing `.env`

### Authentication not working
- Clear browser cookies
- Check `JWT_SECRET` is set in backend `.env`
- Verify cookies are enabled in browser

### Data not loading
- Check browser console for errors
- Verify backend is running
- Check Network tab for failed API requests

---

## 🚀 Production Deployment

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gearguard
JWT_SECRET=use_a_very_strong_random_string_here_at_least_32_characters_long
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure production MongoDB URI
- [ ] Enable HTTPS (set `secure: true` for cookies)
- [ ] Configure proper CORS origin
- [ ] Build frontend: `npm run build`
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (nginx)
- [ ] Enable monitoring and logging

---

## 📊 Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🎨 UI/UX Features

### Loading States
- Spinner animations during data fetch
- Disabled buttons during operations
- Skeleton loaders (where applicable)

### Error Handling
- Alert components for critical errors
- Toast notifications for operation feedback
- Meaningful error messages
- Network error handling

### User Feedback
- Toast notifications on all CRUD operations
- Success confirmations
- Error messages
- Loading indicators

---

## 🔄 Workflows

### Corrective Maintenance Flow
1. **Employee** creates breakdown request
2. Selects equipment → Maintenance team auto-assigned
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

---

## 📈 Future Enhancements

### Recommended Features
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Pagination for large datasets
- [ ] Export data (CSV, PDF)
- [ ] File upload for equipment images
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile responsive improvements
- [ ] PWA support
- [ ] Multi-language support

### Performance Optimizations
- [ ] Implement React Query for caching
- [ ] Add service worker for offline support
- [ ] Optimize bundle size
- [ ] Implement lazy loading
- [ ] Add database indexing
- [ ] Implement Redis caching

---

## 🤝 Contributing

This is an enterprise-grade implementation. Follow these guidelines:

- Maintain clean separation between Client and Server
- Follow existing code patterns
- Add validation for all inputs
- Document new features
- Test role-based access
- Preserve business logic rules

---

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

---

## 🎓 Technologies Used

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- Express Validator
- Helmet for security
- CORS middleware
- Express Rate Limit

### Frontend
- Next.js 14 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI + Shadcn/ui
- Axios for HTTP requests
- Sonner for toast notifications
- React Context API for state management

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

Built with modern MERN stack best practices for enterprise maintenance tracking.

---

**GearGuard - Keeping Your Equipment Running Smoothly** ⚙️

**Integration Status**: ✅ Complete & Production Ready  
**Last Updated**: 2025-12-27
