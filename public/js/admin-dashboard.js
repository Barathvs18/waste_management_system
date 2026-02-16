// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || user.role !== 'admin') {
    window.location.href = '/login';
}

let currentComplaintId = null;
let cleanersList = [];

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Show alert
function showAlert(message, type = 'success', containerId = 'routeAlert') {
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

// Load analytics
async function loadAnalytics() {
    try {
        const response = await fetch('/api/complaints/analytics', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('totalComplaints').textContent = data.data.total;
            document.getElementById('collectedComplaints').textContent = data.data.collected;
            document.getElementById('pendingComplaints').textContent = data.data.pending;
            document.getElementById('notCollectedComplaints').textContent = data.data.notCollected;
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Load cleaners for dropdowns
async function loadCleanersForDropdown() {
    try {
        const response = await fetch('/api/cleaners', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            cleanersList = data.data;

            // Update route form dropdown
            const routeSelect = document.getElementById('routeCleaner');
            routeSelect.innerHTML = '<option value="">Select a cleaner...</option>' +
                cleanersList.map(cleaner =>
                    `<option value="${cleaner._id}">${cleaner.name} - ${cleaner.assignedArea} (${cleaner.vehicleNumber})</option>`
                ).join('');

            // Update assign form dropdown
            const assignSelect = document.getElementById('assignCleaner');
            assignSelect.innerHTML = '<option value="">Choose a cleaner...</option>' +
                cleanersList.map(cleaner =>
                    `<option value="${cleaner._id}">${cleaner.name} - ${cleaner.assignedArea}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error loading cleaners:', error);
    }
}

// Create route
document.getElementById('routeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const routeData = {
        cleanerId: document.getElementById('routeCleaner').value,
        area: document.getElementById('routeArea').value,
        date: document.getElementById('routeDate').value,
        startTime: document.getElementById('routeStartTime').value,
        endTime: document.getElementById('routeEndTime').value,
        description: document.getElementById('routeDescription').value
    };

    try {
        const response = await fetch('/api/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(routeData)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Route created successfully!', 'success', 'routeAlert');
            document.getElementById('routeForm').reset();
            loadRoutes();
        } else {
            showAlert(data.message || 'Failed to create route', 'error', 'routeAlert');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.', 'error', 'routeAlert');
        console.error('Error:', error);
    }
});

// Load complaints
async function loadComplaints() {
    const container = document.getElementById('complaintsContainer');
    container.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch('/api/complaints', {
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
            <h3>No Complaints</h3>
            <p>No complaints have been registered yet</p>
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
                <th>User</th>
                <th>Area</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.map(complaint => `
                <tr>
                  <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>${complaint.userName}</td>
                  <td>${complaint.area}</td>
                  <td>${complaint.description}</td>
                  <td>${getStatusBadge(complaint.status)}</td>
                  <td>${complaint.cleanerName || '-'}</td>
                  <td>
                    ${complaint.status === 'pending' ?
                    `<button onclick="openAssignModal('${complaint._id}')" 
                        class="btn btn-primary" 
                        style="padding: 0.375rem 0.75rem; font-size: 0.875rem;">
                        Assign
                      </button>`
                    : '-'
                }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

            loadAnalytics();
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

// Load cleaners
async function loadCleaners() {
    const container = document.getElementById('cleanersContainer');
    container.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch('/api/cleaners', {
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
            <h3>No Cleaners</h3>
            <p>No cleaners have been registered yet</p>
          </div>
        `;
                return;
            }

            container.innerHTML = `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Assigned Area</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.map(cleaner => `
                <tr>
                  <td>${cleaner.name}</td>
                  <td>${cleaner.email}</td>
                  <td>${cleaner.phone}</td>
                  <td>${cleaner.vehicleNumber}</td>
                  <td>${cleaner.assignedArea}</td>
                  <td>${getCleanerStatusBadge(cleaner.status)}</td>
                  <td>${cleaner.currentLocation || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

            loadCleanersForDropdown();
        } else {
            container.innerHTML = `
        <div class="alert alert-error">
          Failed to load cleaners
        </div>
      `;
        }
    } catch (error) {
        container.innerHTML = `
      <div class="alert alert-error">
        An error occurred while loading cleaners
      </div>
    `;
        console.error('Error:', error);
    }
}

// Load routes
async function loadRoutes() {
    const container = document.getElementById('routesContainer');
    container.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch('/api/routes', {
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
            <h3>No Routes</h3>
            <p>Create routes using the form above</p>
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
                <th>Cleaner</th>
                <th>Area</th>
                <th>Time</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.map(route => `
                <tr>
                  <td>${new Date(route.date).toLocaleDateString()}</td>
                  <td>${route.cleanerName}</td>
                  <td>${route.area}</td>
                  <td>${route.startTime} - ${route.endTime}</td>
                  <td>${route.description || '-'}</td>
                  <td>${getRouteStatusBadge(route.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
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

// Modal functions
function openAssignModal(complaintId) {
    currentComplaintId = complaintId;
    document.getElementById('assignModal').style.display = 'flex';
}

function closeAssignModal() {
    currentComplaintId = null;
    document.getElementById('assignModal').style.display = 'none';
    document.getElementById('assignForm').reset();
}

// Assign complaint
document.getElementById('assignForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cleanerId = document.getElementById('assignCleaner').value;
    const expectedArrival = document.getElementById('expectedArrival').value;

    try {
        const response = await fetch(`/api/complaints/${currentComplaintId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cleanerId, expectedArrival })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Complaint assigned successfully!', 'success', 'assignAlert');
            setTimeout(() => {
                closeAssignModal();
                loadComplaints();
            }, 1500);
        } else {
            showAlert(data.message || 'Failed to assign complaint', 'error', 'assignAlert');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.', 'error', 'assignAlert');
        console.error('Error:', error);
    }
});

// Status badge functions
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Pending</span>',
        'assigned': '<span class="badge badge-info">Assigned</span>',
        'collected': '<span class="badge badge-success">Collected</span>',
        'not_collected': '<span class="badge badge-danger">Not Collected</span>'
    };
    return badges[status] || '<span class="badge badge-warning">Unknown</span>';
}

function getCleanerStatusBadge(status) {
    const badges = {
        'idle': '<span class="badge badge-warning">Idle</span>',
        'on_the_way': '<span class="badge badge-info">On the Way</span>',
        'arrived': '<span class="badge badge-success">Arrived</span>',
        'completed': '<span class="badge badge-success">Completed</span>'
    };
    return badges[status] || '<span class="badge badge-warning">Unknown</span>';
}

function getRouteStatusBadge(status) {
    const badges = {
        'scheduled': '<span class="badge badge-warning">Scheduled</span>',
        'in_progress': '<span class="badge badge-info">In Progress</span>',
        'completed': '<span class="badge badge-success">Completed</span>'
    };
    return badges[status] || '<span class="badge badge-warning">Unknown</span>';
}

// Set minimum date for route creation to today
document.getElementById('routeDate').min = new Date().toISOString().split('T')[0];

// Load data on page load
loadAnalytics();
loadComplaints();
loadCleaners();
loadRoutes();
