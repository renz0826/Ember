/* ==========================================
            LOADING SCREEN DISPLAY
   ========================================== */

// This provides visual feedback during page transitions/server processing
document.addEventListener("DOMContentLoaded", function () {
  // Get the first form on the page and the loading screen overlay element
  const form = document.querySelector("form");
  const loadingScreen = document.getElementById("loading-screen");

  // Ensures both elements exist before attaching event listener
  if (form && loadingScreen) {
    // When form is submitted, add "is-loading" class to display the overlay
    form.addEventListener("submit", function (event) {
      loadingScreen.classList.add("is-loading");
    });
  }
});

/* ==========================================
                VALIDATE LOGIN
   ========================================== */

// Real-time form validation for login page.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");

  // Check if username field is empty; update styling and error message
  function validateUsername() {
    const value = username.value.trim();
    if (value === "") {
      showError(username, usernameError, "Please fill out this field");
      return false;
    } else {
      showSuccess(username, usernameError);
      return true;
    }
  }

  // Check if password field is empty; update styling and error message
  function validatePassword() {
    const value = password.value.trim();
    if (value === "") {
      showError(password, passwordError, "Please fill out this field");
      return false;
    } else {
      showSuccess(password, passwordError);
      return true;
    }
  }

  // Mark field as invalid: add error class, set error text, show message
  function showError(input, errorElement, message) {
    input.classList.add("error-input");
    input.classList.remove("success-input");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.opacity = "1";
    }
  }

  // Mark field as valid: add success class, hide error message
  function showSuccess(input, errorElement) {
    input.classList.remove("error-input");
    input.classList.add("success-input");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.opacity = "0";
    }
  }

  // Attach real-time validation listeners
  if (username) username.addEventListener("input", validateUsername);
  if (password) password.addEventListener("input", validatePassword);

  // Validate before sending to PHP
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // block default browser submission
      const isUsernameValid = validateUsername();
      const isPasswordValid = validatePassword();
      // Only submit if both fields pass validation
      if (isUsernameValid && isPasswordValid) {
        form.submit();
      }
    });
  }
});

