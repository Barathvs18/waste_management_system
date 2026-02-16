# 🚀 QUICK START GUIDE

## ✅ Installation Complete!

Your Digital Waste Collection Management System is ready to use!

## 🌐 Access the Application

The server is running on: **http://localhost:5000**

Open your web browser and navigate to this URL.

## 📱 Test the Application

### Step 1: Register a Cleaner Account

1. Go to **http://localhost:5000/register**
2. Click on the **"Cleaner"** tab
3. Fill in the details:
   - Name: John Driver
   - Email: cleaner@test.com
   - Password: test123
   - Phone: +1234567890
   - Vehicle Number: WM-101
   - Assigned Area: Downtown
4. Click **Register as Cleaner**

### Step 2: Login as Admin

1. Go to **http://localhost:5000/login**
2. Select **"Admin"** from the dropdown
3. Enter credentials:
   - Email: admin@waste.com
   - Password: admin123
4. Click **Sign In**

### Step 3: Create a Route (Admin Dashboard)

1. In the admin dashboard, scroll to **"Create New Route"**
2. Fill in the route details:
   - Select Cleaner: John Driver - Downtown
   - Area: Downtown
   - Date: Select today's date
   - Start Time: 09:00
   - End Time: 17:00
   - Description: Daily waste collection
3. Click **Create Route**

### Step 4: Register a User Account

1. Logout from admin
2. Go to **http://localhost:5000/register**
3. Make sure **"User"** tab is selected
4. Fill in the details:
   - Name: Jane Citizen
   - Email: user@test.com
   - Password: test123
   - Area: Downtown
   - Phone: +9876543210
5. Click **Register**

### Step 5: Submit a Complaint (User Dashboard)

1. In the user dashboard, find **"Register New Complaint"**
2. Enter or keep the default description: "Waste Not Collected"
3. Click **Submit Complaint**
4. You should see your complaint in the complaints list below

### Step 6: Assign Complaint (Admin)

1. Login as admin again (admin@waste.com / admin123)
2. Scroll to **"All Complaints"** section
3. Find the complaint from Jane Citizen
4. Click **Assign** button
5. In the modal:
   - Select Cleaner: John Driver - Downtown
   - Expected Arrival: Within 2 hours
6. Click **Assign**

### Step 7: Update Status (Cleaner Dashboard)

1. Logout and login as cleaner (cleaner@test.com / test123)
2. In the cleaner dashboard:
   - Update Live Status to "On the Way"
   - Click **Update Status**
3. Scroll to **"Assigned Complaints"**
4. Find the complaint and click **✓ Collected** or **✗ Not Collected**

### Step 8: Check User Dashboard

1. Login as user (user@test.com / test123)
2. View your complaint with updated status
3. You should see:
   - Assigned cleaner: John Driver
   - Expected arrival time
   - **📞 Call** button with cleaner's phone number

## 📊 Features to Test

### User Dashboard
- ✅ Submit multiple complaints
- ✅ View complaint history
- ✅ See status updates
- ✅ Click call button for cleaner contact

### Cleaner Dashboard
- ✅ Update live status (Idle/On the Way/Arrived/Completed)
- ✅ View assigned complaints
- ✅ Mark complaints as collected/not collected
- ✅ View and manage routes
- ✅ Update route status (Start/Complete)

### Admin Dashboard
- ✅ View analytics (total, collected, pending)
- ✅ Create routes for cleaners
- ✅ Assign complaints to cleaners
- ✅ Monitor all cleaners
- ✅ View all routes and complaints

## 🛑 Stop the Server

To stop the server, press **Ctrl + C** in the PowerShell window where it's running.

## 🔄 Restart the Server

```powershell
cd c:\Users\V.S.BARATH\Desktop\digital_waste_management
npm start
```

## 📝 Important Notes

1. **MongoDB**: Make sure MongoDB is running on your system. The application connects to `mongodb://localhost:27017/waste_management`

2. **Default Admin Credentials**:
   - Email: admin@waste.com
   - Password: admin123

3. **Port**: Application runs on port 5000 by default

4. **Browser**: Works best on Chrome, Firefox, or Edge

## 🐛 Troubleshooting

### If MongoDB connection fails:

**Option 1**: Install MongoDB locally
- Download from: https://www.mongodb.com/try/download/community
- Install and it will run as a Windows service

**Option 2**: Use MongoDB Atlas (free cloud database)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update the `.env` file:
   ```
   MONGODB_URI=your_atlas_connection_string
   ```
5. Restart the server

### If port 5000 is already in use:

Update the `.env` file:
```
PORT=3000
```
Then restart the server and access at http://localhost:3000

## 🎉 Enjoy Using the System!

The application is now fully functional with:
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Modern responsive UI
- ✅ Real-time status updates
- ✅ Complete CRUD operations
- ✅ MongoDB integration

For detailed documentation, see **README.md**
