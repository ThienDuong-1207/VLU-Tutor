document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        handleLogin(email, password);
    });
});

function quickLogin(email, password) {
    handleLogin(email, password);
}

function handleLogin(email, password) {
    // Validate email domain
    if (!email.endsWith('@vlu.edu.vn')) {
        showError('Email phải thuộc domain @vlu.edu.vn');
        return;
    }

    // Demo login logic
    const users = {
        'student@vlu.edu.vn': { role: 'student', password: '123456' },
        'tutor@vlu.edu.vn': { role: 'tutor', password: '123456' },
        'center@vlu.edu.vn': { role: 'center', password: '123456' },
        'admin@vlu.edu.vn': { role: 'admin', password: '123456' }
    };

    const user = users[email];
    if (user && user.password === password) {
        // Store user info in session
        sessionStorage.setItem('currentUser', JSON.stringify({
            email: email,
            role: user.role
        }));

        // Redirect to appropriate dashboard
        redirectToDashboard(user.role);
    } else {
        showError('Email hoặc mật khẩu không chính xác');
    }
}

function redirectToDashboard(role) {
    const dashboards = {
        student: 'dashboard/student.html',
        tutor: 'dashboard/tutor.html',
        center: 'dashboard/center.html',
        admin: 'dashboard/admin.html'
    };

    window.location.href = dashboards[role];
}

function showError(message) {
    // Create error element if it doesn't exist
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        const loginForm = document.getElementById('loginForm');
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }

    // Show error message with animation
    errorDiv.textContent = message;
    errorDiv.style.animation = 'fadeIn 0.5s ease-out';

    // Auto hide after 3 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            errorDiv.remove();
        }, 500);
    }, 3000);
}

// Add these styles to the document
const style = document.createElement('style');
style.textContent = `
    .error-message {
        background-color: #ff4444;
        color: white;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        text-align: center;
        font-size: 14px;
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style); 