document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    const strengthMeter = document.getElementById('passwordStrength');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const capsLockWarning = document.getElementById('capsLockWarning');
    const themeToggle = document.getElementById('themeToggle');

    // Theme Toggle Logic
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    const setTheme = (isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (isDark) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme(true);
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon based on state
        if (type === 'text') {
            togglePasswordBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            togglePasswordBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });

    // Caps Lock Warning Logic
    const checkCapsLock = (e) => {
        if (e.getModifierState && e.getModifierState('CapsLock')) {
            capsLockWarning.classList.add('show');
        } else {
            capsLockWarning.classList.remove('show');
        }
    };
    
    passwordInput.addEventListener('keyup', checkCapsLock);
    passwordInput.addEventListener('keydown', checkCapsLock);
    passwordInput.addEventListener('mousedown', checkCapsLock);

    // Password strength logic
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        
        if (val.length > 0) {
            strengthMeter.classList.add('show');
        } else {
            strengthMeter.classList.remove('show');
        }

        // Reset bars
        strengthBars.forEach(bar => bar.style.backgroundColor = 'var(--border-color)');

        let strength = 0;
        if (val.length >= 6) strength += 1;
        if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) strength += 1;
        if (val.length >= 10 && /[^A-Za-z0-9]/.test(val)) strength += 1;

        if (strength >= 1) strengthBars[0].style.backgroundColor = 'var(--error-color)';
        if (strength >= 2) {
            strengthBars[0].style.backgroundColor = 'var(--warning-color)';
            strengthBars[1].style.backgroundColor = 'var(--warning-color)';
        }
        if (strength >= 3) {
            strengthBars[0].style.backgroundColor = 'var(--success-color)';
            strengthBars[1].style.backgroundColor = 'var(--success-color)';
            strengthBars[2].style.backgroundColor = 'var(--success-color)';
        }

        // Clear error on input
        if (passwordInput.closest('.floating-label-group').classList.contains('error')) {
            clearError(passwordInput, passwordError);
        }
    });

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const showError = (input, errorElement, message) => {
        const group = input.closest('.floating-label-group');
        group.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        input.setAttribute('aria-invalid', 'true');
    };

    const clearError = (input, errorElement) => {
        const group = input.closest('.floating-label-group');
        group.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        input.removeAttribute('aria-invalid');
    };

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);

        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value) {
            showError(passwordInput, passwordError, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            // Simulate API call / form submission
            const btn = document.getElementById('submitBtn');
            const btnText = btn.querySelector('.btn-text');
            const spinner = btn.querySelector('.spinner');
            
            btnText.style.display = 'none';
            spinner.style.display = 'block';
            btn.disabled = true;

            setTimeout(() => {
                alert('Sign in successful!');
                btnText.style.display = 'block';
                spinner.style.display = 'none';
                btn.disabled = false;
                loginForm.reset();
                strengthMeter.classList.remove('show');
            }, 1500);
        }
    });

    // Real-time validation clearing on input
    emailInput.addEventListener('input', () => {
        if (emailInput.closest('.floating-label-group').classList.contains('error')) {
            clearError(emailInput, emailError);
        }
    });
});
