// Toggle password visibility (Show / Hide)
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        this.textContent = isPassword ? 'Hide' : 'Show';
    });
}

// Form submission & Role-based authentication logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorBanner = document.getElementById('errorMessage');

        // Reset error state
        if (errorBanner) {
            errorBanner.style.display = 'none';
            errorBanner.textContent = '';
        }

        // Validation 1: Check required fields
        if (!email || !password) {
            showError("Please fill in all fields.");
            return;
        }

        // Validation 2: Minimum password length check
        if (password.length < 6) {
            showError("Password must be at least 6 characters.");
            return;
        }

        // Check for specific Seller credentials
        if (email === 'Seller@gmail.com' && password === 'Seller12345') {
            localStorage.setItem('currentUser', JSON.stringify({ email: email, role: 'seller' }));
            alert('Login successful! Redirecting to Seller Portal...');
            window.location.href = 'seller.html';

        } else {
            // Flexible Customer Login: Accept ANY other email and password!
            localStorage.setItem('currentUser', JSON.stringify({ email: email, role: 'customer' }));
            alert('Login successful! Redirecting to Customer Dashboard...');
            window.location.href = 'side-menu.html';
        }
    });
}

function showError(message) {
    const errorBanner = document.getElementById('errorMessage');
    if (errorBanner) {
        errorBanner.textContent = message;
        errorBanner.style.display = 'block';
    }
}