//this script validates username and password fields, displaying custom error messages
//and visual indicators (borders) to guide users before form submission.

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    function validateUsername() {
        const value = username.value.trim();
        
        if (value === '') {
            showError(username, usernameError, 'Please fill out this field');
            return false;
        } else {
            showSuccess(username, usernameError);
            return true;
        }
    }

    function validatePassword() {
        const value = password.value.trim();
        
        if (value === '') {
            showError(password, passwordError, 'Please fill out this field');
            return false;
        } else {
            showSuccess(password, passwordError);
            return true;
        }
    }

    function showError(input, errorElement, message) {
        input.classList.add('error-input');
        input.classList.remove('success-input');
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error-input');
        input.classList.add('success-input');
        errorElement.textContent = '';
        errorElement.style.opacity = '0';
    }

    function clearValidation(input, errorElement) {
        input.classList.remove('error-input', 'success-input');
        errorElement.textContent = '';
        errorElement.style.opacity = '0';
    }

    //real-time validation on input
    username.addEventListener('input', validateUsername);
    password.addEventListener('input', validatePassword);

    //form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();

        if (isUsernameValid && isPasswordValid) {
            form.submit();
        }
    });
});