document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  // MATCHED HTML: These IDs must exist in the HTML now
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");

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

  function showError(input, errorElement, message) {
    input.classList.add("error-input");
    input.classList.remove("success-input");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.opacity = "1";
    }
  }

  function showSuccess(input, errorElement) {
    input.classList.remove("error-input");
    input.classList.add("success-input");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.opacity = "0";
    }
  }

  // Real-time validation
  if (username) username.addEventListener("input", validateUsername);
  if (password) password.addEventListener("input", validatePassword);

  // Form submission
  if (form) {
    form.addEventListener("submit", function (e) {
      // 1. Prevent default submission initially
      e.preventDefault();

      // 2. Run checks
      const isUsernameValid = validateUsername();
      const isPasswordValid = validatePassword();

      // 3. If JS validates, submit the form to PHP
      if (isUsernameValid && isPasswordValid) {
        form.submit();
      }
    });
  }
});
