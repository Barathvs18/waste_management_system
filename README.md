# 🗑️ Digital Waste Collection Management System

A full-stack web application for managing waste collection operations with separate dashboards for public users, cleaners/drivers, and administrators.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### 👥 For Public Users
- ✅ Register waste collection complaints with quick action buttons
- ✅ View complaint status in real-time
- ✅ See assigned cleaner details (name, phone)
- ✅ Direct call button to contact cleaners
- ✅ View complaint history

### 🚛 For Cleaners/Drivers
- ✅ View assigned areas and routes
- ✅ See complaints in their route
- ✅ Update waste collection status (✅ Waste Collected / ❌ Not Collected)
- ✅ Update live status (Idle/On the Way/Arrived/Completed)
- ✅ Manage daily route list

### 🛠️ For Admins
- ✅ Assign cleaners to areas
- ✅ Create and post routes for cleaners
- ✅ View all complaints
- ✅ Monitor cleaner status
- ✅ View analytics dashboard (Total, Collected, Pending, Not Collected)
- ✅ Manage users and cleaners

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Docker & Docker Compose ready

## 📁 Project Structure

```
digital_waste_management/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Cleaner.js
│   ├── Complaint.js
│   └── Route.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── complaintController.js
│   ├── cleanerController.js
│   └── routeController.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   ├── cleanerRoutes.js
│   └── routeRoutes.js
├── middleware/         # Authentication middleware
│   └── auth.js
├── public/            # Frontend files
│   ├── css/
│   ├── js/
│   └── *.html
├── Dockerfile
├── docker-compose.yml
└── server.js          # Main server file
```

## 🛠️ Installation & Setup

### Option 1: Using Docker (Recommended)

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop/

2. **Clone the repository**
   ```bash
   git clone https://github.com/Barathvs18/waste_management_system.git
   cd waste_management_system
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   ```
   http://localhost:3000
   ```

### Option 2: Manual Installation

1. **Prerequisites**
   - Node.js (v14+)
   - MongoDB (local or MongoDB Atlas)

2. **Clone the repository**
   ```bash
   git clone https://github.com/Barathvs18/waste_management_system.git
   cd waste_management_system
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/waste_management
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   ADMIN_EMAIL=admin@waste.com
   ADMIN_PASSWORD=admin123
   ```

5. **Start MongoDB** (if using local installation)

6. **Run the application**
   ```bash
   npm start
   ```

7. **Access the application**
   ```
   http://localhost:3000
   ```

## 🔐 Default Credentials

### Admin Login
- **Email**: admin@waste.com
- **Password**: admin123

> ⚠️ **Important**: Change default admin credentials in production!

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/register-cleaner` - Register new cleaner
- `POST /api/auth/login` - Login user/cleaner
- `POST /api/auth/admin-login` - Admin login

### Complaint Endpoints
- `POST /api/complaints` - Create complaint (User)
- `GET /api/complaints/my-complaints` - Get user's complaints (User)
- `GET /api/complaints/cleaner-complaints` - Get cleaner's complaints (Cleaner)
- `GET /api/complaints` - Get all complaints (Admin)
- `PUT /api/complaints/:id/assign` - Assign complaint to cleaner (Admin)
- `PUT /api/complaints/:id/status` - Update complaint status (Cleaner)
- `GET /api/complaints/analytics` - Get analytics (Admin)

### Cleaner Endpoints
- `GET /api/cleaners/profile` - Get cleaner profile (Cleaner)
- `PUT /api/cleaners/status` - Update cleaner status (Cleaner)
- `GET /api/cleaners` - Get all cleaners (Admin)
- `PUT /api/cleaners/:id/area` - Update cleaner area (Admin)

### Route Endpoints
- `GET /api/routes/my-routes` - Get cleaner's routes (Cleaner)
- `PUT /api/routes/:id/status` - Update route status (Cleaner)
- `POST /api/routes` - Create route (Admin)
- `GET /api/routes` - Get all routes (Admin)

## 🎨 UI Features

- ✅ Modern dark theme with gradients
- ✅ Responsive design (mobile & desktop)
- ✅ Status badges with color coding
- ✅ Real-time data refresh
- ✅ Loading spinners
- ✅ Toast notifications
- ✅ Clean card-based layout

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected API routes with middleware
- ✅ Role-based access control
- ✅ Environment variables for sensitive data

## 📊 Database Schemas

### User Schema
- name, email, password (hashed), area, phone, role

### Cleaner Schema
- name, email, password (hashed), phone, vehicleNumber, assignedArea, status, currentLocation

### Complaint Schema
- userId, userEmail, userName, area, description, status, assignedCleaner, cleanerName, cleanerPhone, expectedArrival, collectionDate

### Route Schema
- cleanerId, cleanerName, area, date, startTime, endTime, description, status

## 🚀 Deployment

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Deploy to Cloud Platforms

- **Heroku**: Container deployment ready
- **DigitalOcean**: App Platform compatible
- **AWS**: ECS/Fargate ready
- **Google Cloud**: Cloud Run compatible

See `DOCKER_GUIDE.md` for detailed deployment instructions.

## 📚 Documentation

- **README.md** - This file
- **QUICK_START.md** - Quick testing guide
- **API_TESTING.md** - API endpoint examples
- **DOCKER_GUIDE.md** - Docker deployment guide
- **PROJECT_SUMMARY.md** - Complete feature overview
- **UPDATES.md** - Recent updates and changes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Barath VS**
- GitHub: [@Barathvs18](https://github.com/Barathvs18)

## 🙏 Acknowledgments

- Built with ❤️ for cleaner cities
- Modern UI design inspired by current web trends
- Docker containerization for easy deployment

## 📧 Support

For issues and questions, please create an issue on GitHub.

---

**⭐ Star this repository if you find it helpful!**
