# Digital Waste Collection Management System

A full-stack web application for managing waste collection operations with separate dashboards for public users, cleaners/drivers, and administrators.

## 🚀 Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with bcrypt password hashing

## 👥 User Roles

### 1. Public User
- Register waste collection complaints
- View complaint status in real-time
- See assigned cleaner details
- Contact cleaners directly via phone
- View complaint history

### 2. Cleaner/Driver
- View assigned areas and routes
- See complaints in their route
- Update waste collection status (Collected/Not Collected)
- Update live status (Idle/On the Way/Arrived/Completed)
- Manage daily route list

### 3. Admin
- Assign cleaners to areas
- Create and post routes for cleaners
- View all complaints
- Monitor cleaner status
- View analytics dashboard
- Manage users and cleaners

## 📁 Project Structure

```
digital_waste_management/
├── models/
│   ├── User.js
│   ├── Cleaner.js
│   ├── Complaint.js
│   └── Route.js
├── controllers/
│   ├── authController.js
│   ├── complaintController.js
│   ├── cleanerController.js
│   └── routeController.js
├── routes/
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   ├── cleanerRoutes.js
│   └── routeRoutes.js
├── middleware/
│   └── auth.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── user-dashboard.js
│   │   ├── cleaner-dashboard.js
│   │   └── admin-dashboard.js
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── user-dashboard.html
│   ├── cleaner-dashboard.html
│   └── admin-dashboard.html
├── .env
├── server.js
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Step 1: Install MongoDB

#### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will run as a Windows service automatically

#### Alternative: Use MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string and update it in `.env` file

### Step 2: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

### Step 3: Configure Environment Variables

The `.env` file is already created with default values. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@waste.com
ADMIN_PASSWORD=admin123
```

### Step 4: Start MongoDB

If using local MongoDB:

```powershell
# MongoDB should already be running as a service on Windows
# To verify, open Services (services.msc) and check for "MongoDB Server"
```

### Step 5: Run the Application

```powershell
# Development mode with auto-restart
npm run dev

# OR Production mode
npm start
```

The application will be available at: **http://localhost:5000**

## 🔐 Default Credentials

### Admin Login
- **Email**: admin@waste.com
- **Password**: admin123

### Test Users
You need to register new users and cleaners through the registration pages.

## 📋 Usage Guide

### For Public Users

1. **Register**: Go to `/register` and fill in your details
   - Name, Email, Password, Area, Phone Number

2. **Login**: Use your credentials at `/login` (select "User" role)

3. **Dashboard Features**:
   - Submit new complaints about uncollected waste
   - View all your complaints with status
   - See assigned cleaner name and phone
   - Call cleaner directly from the dashboard
   - Track complaint history

### For Cleaners

1. **Register**: Go to `/register` and switch to "Cleaner" tab
   - Name, Email, Password, Phone, Vehicle Number, Assigned Area

2. **Login**: Use your credentials at `/login` (select "Cleaner" role)

3. **Dashboard Features**:
   - Update your live status (Idle, On the Way, Arrived, Completed)
   - View complaints in your assigned area
   - Mark complaints as Collected or Not Collected
   - View your daily routes assigned by admin
   - Update route status (Start Route, Complete)

### For Admin

1. **Login**: Use admin credentials at `/login` (select "Admin" role)

2. **Dashboard Features**:
   - View analytics (Total, Collected, Pending, Not Collected)
   - Create new routes for cleaners
   - View all complaints from all areas
   - Assign complaints to specific cleaners
   - Monitor all cleaners and their status
   - View all scheduled routes

## 🗄️ Database Schemas

### User Schema
- name, email, password (hashed), area, phone, role

### Cleaner Schema
- name, email, password (hashed), phone, vehicleNumber, assignedArea, status, currentLocation

### Complaint Schema
- userId, userEmail, userName, area, description, status, assignedCleaner, cleanerName, cleanerPhone, expectedArrival, collectionDate

### Route Schema
- cleanerId, cleanerName, area, date, startTime, endTime, description, status

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected API routes with middleware
- ✅ Role-based access control
- ✅ Token expiration (7 days)
- ✅ Environment variables for sensitive data

## 🎨 UI Features

- ✅ Modern dark theme with gradients
- ✅ Responsive design for mobile and desktop
- ✅ Status badges (Collected, Pending, etc.)
- ✅ Real-time data refresh
- ✅ Loading spinners
- ✅ Alert notifications
- ✅ Clean card-based layout
- ✅ Smooth animations and transitions

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/register-cleaner` - Register new cleaner
- `POST /api/auth/login` - Login user/cleaner
- `POST /api/auth/admin-login` - Admin login

### Complaints
- `POST /api/complaints` - Create complaint (User)
- `GET /api/complaints/my-complaints` - Get user's complaints (User)
- `GET /api/complaints/cleaner-complaints` - Get cleaner's complaints (Cleaner)
- `GET /api/complaints` - Get all complaints (Admin)
- `PUT /api/complaints/:id/assign` - Assign complaint (Admin)
- `PUT /api/complaints/:id/status` - Update status (Cleaner)
- `GET /api/complaints/analytics` - Get analytics (Admin)

### Cleaners
- `GET /api/cleaners/profile` - Get cleaner profile (Cleaner)
- `PUT /api/cleaners/status` - Update status (Cleaner)
- `GET /api/cleaners` - Get all cleaners (Admin)
- `PUT /api/cleaners/:id/area` - Update cleaner area (Admin)
- `DELETE /api/cleaners/:id` - Delete cleaner (Admin)

### Routes
- `GET /api/routes/my-routes` - Get cleaner's routes (Cleaner)
- `PUT /api/routes/:id/status` - Update route status (Cleaner)
- `POST /api/routes` - Create route (Admin)
- `GET /api/routes` - Get all routes (Admin)
- `DELETE /api/routes/:id` - Delete route (Admin)

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: "MongoNetworkError: failed to connect to server"

**Solution**:
1. Ensure MongoDB is running:
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # If not running, start it
   Start-Service -Name MongoDB
   ```

2. Or use MongoDB Atlas connection string in `.env`

### Port Already in Use

**Error**: "EADDRINUSE: address already in use :::5000"

**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Cannot Register/Login

**Solution**:
- Check MongoDB is running
- Verify `.env` file exists with correct values
- Check browser console for errors
- Ensure all npm packages are installed

## 🚀 Deployment

### Deploy to Production

1. Update `.env` with production values:
   ```env
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=generate_strong_secret_key
   ```

2. Use services like:
   - **Heroku** (Backend + Frontend)
   - **Vercel** (Frontend) + **Heroku/Railway** (Backend)
   - **DigitalOcean** (Full stack)

3. Set environment variables in your hosting platform

## 📝 Future Enhancements

- Real-time notifications using Socket.io
- GPS tracking for cleaners
- Mobile application (React Native)
- Email notifications
- SMS alerts
- Payment integration
- Multi-language support
- Analytics graphs and charts
- Export data to CSV/PDF
- Image upload for complaints

## 👨‍💻 Development

### Run in Development Mode

```powershell
npm run dev
```

This uses nodemon for auto-restart on file changes.

### Testing the Application

1. Start the server
2. Register a cleaner account
3. Login as admin and create a route for the cleaner
4. Register a user account
5. Login as user and create a complaint
6. Login as admin and assign the complaint to the cleaner
7. Login as cleaner and update the complaint status

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Support

For issues and questions:
- Check the troubleshooting section
- Ensure all dependencies are installed
- Verify MongoDB is running
- Check browser console for errors

---

**Built with ❤️ for cleaner cities**
