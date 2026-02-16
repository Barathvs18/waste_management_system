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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('roleSelect').value;

    try {
        let endpoint = '/api/auth/login';

        if (role === 'admin') {
            endpoint = '/api/auth/admin-login';
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showAlert('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else if (data.user.role === 'cleaner') {
                    window.location.href = '/cleaner-dashboard';
                } else {
                    window.location.href = '/user-dashboard';
                }
            }, 1500);
        } else {
            showAlert(data.message || 'Login failed');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.');
        console.error('Error:', error);
    }
});
