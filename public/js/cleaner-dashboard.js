// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || user.role !== 'cleaner') {
  window.location.href = '/login';
}

// Display cleaner info
document.getElementById('cleanerName').textContent = user.name;
document.getElementById('profileName').textContent = user.name;
document.getElementById('profileVehicle').textContent = user.vehicleNumber;
document.getElementById('profileArea').textContent = user.area;

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Show alert
function showAlert(message, type = 'success', containerId = 'statusAlert') {
  const alertContainer = document.getElementById(containerId);
  const alertClass = type === 'error' ? 'alert-error' : 'alert-success';

  alertContainer.innerHTML = `
    <div class="alert ${alertClass}">
      ${message}
    </div>
  `;

  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

// Update status
document.getElementById('statusForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const status = document.getElementById('status').value;
  const currentLocation = document.getElementById('location').value;

  try {
    const response = await fetch('/api/cleaners/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, currentLocation })
    });

    const data = await response.json();

    if (data.success) {
      showAlert('Status updated successfully!', 'success');
    } else {
      showAlert(data.message || 'Failed to update status', 'error');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'error');
    console.error('Error:', error);
  }
});

// Load complaints
async function loadComplaints() {
  const container = document.getElementById('complaintsContainer');
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch('/api/complaints/cleaner-complaints', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      if (data.data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No Complaints Assigned</h3>
            <p>Check back later for new assignments</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Area</th>
                <th>User</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.map(complaint => `
                <tr>
                  <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>${complaint.area}</td>
                  <td>${complaint.userName}</td>
                  <td>${complaint.description}</td>
                  <td>${getStatusBadge(complaint.status)}</td>
                  <td>
                    <div style="display: flex; gap: 0.5rem;">
                      <button onclick="updateComplaintStatus('${complaint._id}', 'collected')" 
                        class="btn btn-primary" 
                        style="padding: 0.375rem 0.75rem; font-size: 0.875rem; font-weight: 600;">
                        ✅ Waste Collected
                      </button>
                      <button onclick="updateComplaintStatus('${complaint._id}', 'not_collected')" 
                        class="btn btn-danger" 
                        style="padding: 0.375rem 0.75rem; font-size: 0.875rem; font-weight: 600;">
                        ❌ Not Collected
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="alert alert-error">
          Failed to load complaints
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">
        An error occurred while loading complaints
      </div>
    `;
    console.error('Error:', error);
  }
}

// Update complaint status
async function updateComplaintStatus(complaintId, status) {
  try {
    const response = await fetch(`/api/complaints/${complaintId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (data.success) {
      const statusText = status === 'collected' ? '✅ Waste Collected' : '❌ Not Collected';
      showAlert(`Status updated: ${statusText}. User and admin will be notified!`, 'success', 'statusAlert');
      loadComplaints();
    } else {
      showAlert(data.message || 'Failed to update complaint', 'error', 'statusAlert');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'error', 'statusAlert');
    console.error('Error:', error);
  }
}

// Load routes
async function loadRoutes() {
  const container = document.getElementById('routesContainer');
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch('/api/routes/my-routes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      if (data.data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No Routes Assigned</h3>
            <p>Check with admin for route assignments</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="grid grid-2">
          ${data.data.map(route => `
            <div class="card">
              <div class="card-header">
                <h4 style="font-size: 1.125rem;">${route.area}</h4>
                ${getRouteStatusBadge(route.status)}
              </div>
              <div class="card-body">
                <p style="margin-bottom: 0.5rem;"><strong>Date:</strong> ${new Date(route.date).toLocaleDateString()}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Time:</strong> ${route.startTime} - ${route.endTime}</p>
                <p style="margin-bottom: 1rem;"><strong>Description:</strong> ${route.description || 'N/A'}</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button onclick="updateRouteStatus('${route._id}', 'in_progress')" 
                    class="btn btn-secondary" 
                    style="padding: 0.375rem 0.75rem; font-size: 0.875rem; flex: 1;">
                    Start Route
                  </button>
                  <button onclick="updateRouteStatus('${route._id}', 'completed')" 
                    class="btn btn-primary" 
                    style="padding: 0.375rem 0.75rem; font-size: 0.875rem; flex: 1;">
                    Complete
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="alert alert-error">
          Failed to load routes
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">
        An error occurred while loading routes
      </div>
    `;
    console.error('Error:', error);
  }
}

// Update route status
async function updateRouteStatus(routeId, status) {
  try {
    const response = await fetch(`/api/routes/${routeId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (data.success) {
      showAlert(`Route ${status.replace('_', ' ')}!`, 'success', 'statusAlert');
      loadRoutes();
    } else {
      showAlert(data.message || 'Failed to update route', 'error', 'statusAlert');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'error', 'statusAlert');
    console.error('Error:', error);
  }
}

// Get status badge
function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-warning">Pending</span>',
    'assigned': '<span class="badge badge-info">Assigned</span>',
    'collected': '<span class="badge badge-success">Collected</span>',
    'not_collected': '<span class="badge badge-danger">Not Collected</span>'
  };
  return badges[status] || '<span class="badge badge-warning">Unknown</span>';
}

// Get route status badge
function getRouteStatusBadge(status) {
  const badges = {
    'scheduled': '<span class="badge badge-warning">Scheduled</span>',
    'in_progress': '<span class="badge badge-info">In Progress</span>',
    'completed': '<span class="badge badge-success">Completed</span>'
  };
  return badges[status] || '<span class="badge badge-warning">Unknown</span>';
}

// Load data on page load
loadComplaints();
loadRoutes();
