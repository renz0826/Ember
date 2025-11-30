<?php
// set a session variable to mark user as logged in
session_start();

// includes head
require_once __DIR__ . '/includes/head.php';
require_once __DIR__ . '/components/button.php';

$username = "";
$message = "";

// check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // get and sanitize input data
    $username = htmlspecialchars($_POST['username'] ?? '');
    $password = htmlspecialchars($_POST['password'] ?? '');
    
    // basic Mock Authentication
    if (empty($username) || empty($password)) {
    } elseif ($username === "user" && $password === "password") {
        // set session variable to mark user as logged in
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        
        // redirect to home page
        header("Location: pages/home.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Ember</title>
    <link rel="stylesheet" href="assets/css/login.css">
</head>

<body>
    <!-- container for loading screen -->
    <div id="loading-screen">
        <div class="loader-content">
            <img src="assets/images/logo-main.png" alt="" class="loader-logo">
            <div class="spinner"></div>
            <p class="loading-text">Logging in...</p>
        </div>
    </div>

    <!-- container for login input fields -->
    <div class="background-container">
        <div class="login">
            <img src="assets/images/logo-typo.png" alt="Ember Logo" class="logo">
            <div class="login-card">

                <form id="loginForm" action="" method="POST" novalidate>
                    <h2 class="welcome-text">WELCOME BACK</h2>
                    <p class="subtitle">Enter your email and password to access your account</p>

                    <?php if (!empty($message)): ?>
                    <div class="server-error">
                        <p> <?= $message; ?> </p>
                    </div>
                    <?php endif; ?>

                    <div class="input-group">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter Username"
                            value="<?= $username ?>" required>
                        <span id="username-error" class="error-message username-error" aria-live="polite"></span>
                    </div>

                    <div class="input-group">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter Password" required>
                        <span id="password-error" class="error-message password-error" aria-live="polite"></span>
                    </div>

                    <div class="remember-me">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember" class="remember-label">Remember Me</label>
                    </div>

                    <?= renderSubmitButton("Log In", "", "button", "login", "", "submit")?>
                </form>
            </div>
        </div>
    </div>

    <script src="assets/js/validatelogin.js"></script>
    <script src="assets/js/loadingscreen.js"></script>
</body>

</html>