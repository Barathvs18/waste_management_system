// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || user.role !== 'user') {
  window.location.href = '/login';
}

// Display user info
document.getElementById('userName').textContent = user.name;
document.getElementById('userNameDisplay').textContent = user.name;
document.getElementById('userArea').textContent = user.area;

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Show alert
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('complaintAlert');
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

// Select complaint type
function selectComplaint(type) {
  document.getElementById('description').value = type;
}

// Submit complaint
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;

  try {
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ description })
    });

    const data = await response.json();

    if (data.success) {
      showAlert('Complaint registered successfully!', 'success');
      document.getElementById('description').value = 'Waste Not Collected';
      loadComplaints();
    } else {
      showAlert(data.message || 'Failed to register complaint', 'error');
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
    const response = await fetch('/api/complaints/my-complaints', {
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
            <h3>No Complaints Yet</h3>
            <p>Submit your first complaint using the form above</p>
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
                <th>Description</th>
                <th>Status</th>
                <th>Assigned Cleaner</th>
                <th>Expected Arrival</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.map(complaint => `
                <tr>
                  <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>${complaint.description}</td>
                  <td>
                    ${getStatusBadge(complaint.status)}
                  </td>
                  <td>${complaint.cleanerName || '-'}</td>
                  <td>${complaint.expectedArrival || '-'}</td>
                  <td>
                    ${complaint.cleanerPhone ?
          `<a href="tel:${complaint.cleanerPhone}" class="btn btn-primary" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;">
                        📞 Call
                      </a>`
          : '-'
        }
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

// Load complaints on page load
loadComplaints();
