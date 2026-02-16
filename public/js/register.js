let currentRole = 'user';

function switchRole(role) {
    currentRole = role;
    const userForm = document.getElementById('userForm');
    const cleanerForm = document.getElementById('cleanerForm');
    const userRoleBtn = document.getElementById('userRoleBtn');
    const cleanerRoleBtn = document.getElementById('cleanerRoleBtn');

    if (role === 'user') {
        userForm.classList.remove('hidden');
        cleanerForm.classList.add('hidden');
        userRoleBtn.className = 'btn btn-primary';
        cleanerRoleBtn.className = 'btn btn-outline';
    } else {
        userForm.classList.add('hidden');
        cleanerForm.classList.remove('hidden');
        userRoleBtn.className = 'btn btn-outline';
        cleanerRoleBtn.className = 'btn btn-primary';
    }
}

function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
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

// User Registration
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const area = document.getElementById('userArea').value;
    const phone = document.getElementById('userPhone').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, area, phone })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showAlert('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/user-dashboard';
            }, 1500);
        } else {
            showAlert(data.message || 'Registration failed');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.');
        console.error('Error:', error);
    }
});

// Cleaner Registration
document.getElementById('cleanerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('cleanerName').value;
    const email = document.getElementById('cleanerEmail').value;
    const password = document.getElementById('cleanerPassword').value;
    const phone = document.getElementById('cleanerPhone').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const assignedArea = document.getElementById('assignedArea').value;

    try {
        const response = await fetch('/api/auth/register-cleaner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone, vehicleNumber, assignedArea })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showAlert('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/cleaner-dashboard';
            }, 1500);
        } else {
            showAlert(data.message || 'Registration failed');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.');
        console.error('Error:', error);
    }
});
