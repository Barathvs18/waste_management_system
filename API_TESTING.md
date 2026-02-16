# 🔌 API TESTING GUIDE

## Base URL
```
http://localhost:5000
```

## 🧪 Test Using Browser Console or Postman

### 1. Register a User

**Endpoint**: `POST /api/auth/register`

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'test123',
    area: 'Downtown',
    phone: '+1234567890'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Expected Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "area": "Downtown",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

---

### 2. Register a Cleaner

**Endpoint**: `POST /api/auth/register-cleaner`

```javascript
fetch('http://localhost:5000/api/auth/register-cleaner', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test Cleaner',
    email: 'cleaner@example.com',
    password: 'test123',
    phone: '+9876543210',
    vehicleNumber: 'WM-101',
    assignedArea: 'Downtown'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 3. Admin Login

**Endpoint**: `POST /api/auth/admin-login`

```javascript
fetch('http://localhost:5000/api/auth/admin-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@waste.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);
  // Save the token for future requests
  localStorage.setItem('token', data.token);
});
```

---

### 4. User/Cleaner Login

**Endpoint**: `POST /api/auth/login`

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'testuser@example.com',
    password: 'test123',
    role: 'user'  // or 'cleaner'
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);
  localStorage.setItem('token', data.token);
});
```

---

### 5. Create Complaint (User)

**Endpoint**: `POST /api/complaints`
**Auth Required**: Yes (User role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/complaints', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    description: 'Waste Not Collected'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 6. Get My Complaints (User)

**Endpoint**: `GET /api/complaints/my-complaints`
**Auth Required**: Yes (User role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/complaints/my-complaints', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 7. Get All Complaints (Admin)

**Endpoint**: `GET /api/complaints`
**Auth Required**: Yes (Admin role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/complaints', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 8. Assign Complaint to Cleaner (Admin)

**Endpoint**: `PUT /api/complaints/:id/assign`
**Auth Required**: Yes (Admin role)

```javascript
const token = localStorage.getItem('token');
const complaintId = 'YOUR_COMPLAINT_ID';  // Get from complaints list
const cleanerId = 'YOUR_CLEANER_ID';      // Get from cleaners list

fetch(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    cleanerId: cleanerId,
    expectedArrival: 'Within 2 hours'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 9. Update Complaint Status (Cleaner)

**Endpoint**: `PUT /api/complaints/:id/status`
**Auth Required**: Yes (Cleaner role)

```javascript
const token = localStorage.getItem('token');
const complaintId = 'YOUR_COMPLAINT_ID';

fetch(`http://localhost:5000/api/complaints/${complaintId}/status`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'collected'  // or 'not_collected'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 10. Get Analytics (Admin)

**Endpoint**: `GET /api/complaints/analytics`
**Auth Required**: Yes (Admin role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/complaints/analytics', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 11. Update Cleaner Status (Cleaner)

**Endpoint**: `PUT /api/cleaners/status`
**Auth Required**: Yes (Cleaner role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/cleaners/status', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'on_the_way',  // idle, on_the_way, arrived, completed
    currentLocation: 'Near Main Street'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 12. Get All Cleaners (Admin)

**Endpoint**: `GET /api/cleaners`
**Auth Required**: Yes (Admin role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/cleaners', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 13. Create Route (Admin)

**Endpoint**: `POST /api/routes`
**Auth Required**: Yes (Admin role)

```javascript
const token = localStorage.getItem('token');
const cleanerId = 'YOUR_CLEANER_ID';

fetch('http://localhost:5000/api/routes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    cleanerId: cleanerId,
    area: 'Downtown',
    date: '2026-02-17',
    startTime: '09:00',
    endTime: '17:00',
    description: 'Daily waste collection route'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 14. Get My Routes (Cleaner)

**Endpoint**: `GET /api/routes/my-routes`
**Auth Required**: Yes (Cleaner role)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/routes/my-routes', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 15. Update Route Status (Cleaner)

**Endpoint**: `PUT /api/routes/:id/status`
**Auth Required**: Yes (Cleaner role)

```javascript
const token = localStorage.getItem('token');
const routeId = 'YOUR_ROUTE_ID';

fetch(`http://localhost:5000/api/routes/${routeId}/status`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'in_progress'  // scheduled, in_progress, completed
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📋 Common Status Values

### Complaint Status
- `pending` - Newly created
- `assigned` - Assigned to cleaner
- `collected` - Waste collected
- `not_collected` - Waste not collected

### Cleaner Status
- `idle` - Not working
- `on_the_way` - Traveling to location
- `arrived` - Reached location
- `completed` - Task completed

### Route Status
- `scheduled` - Route planned
- `in_progress` - Currently executing
- `completed` - Route finished

---

## 🔐 Authentication Flow

1. **Register** or **Login** to get a JWT token
2. **Save the token** in localStorage or use it directly
3. **Include token** in Authorization header for protected routes:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

---

## ⚠️ Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Please provide all fields"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

## 🧪 Postman Collection

You can import these endpoints to Postman by creating a new collection and adding each endpoint manually, or copy-paste the fetch requests into Postman's "Code" section.

---

**Happy Testing! 🚀**
