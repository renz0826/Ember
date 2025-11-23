<?php

// includes the head
require_once __DIR__ . '/../includes/head.php';


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Ember</title>

<link rel="stylesheet" href="../assets/css/login.css">
</head>

<body>
    <div class="bg-container">
    <div class="login-card">
        <img src="../assets/images/logo-typo.png" alt="Ember Logo" class="logo">

        <form action="login.php" method="POST">
            <h2 class="welcome-text">WELCOME BACK</h2>
            <p class="subtitle">Enter your email  and password to access your account</p>
            
            <!-- input fields for username and password -->
            <div class="input-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter username" required>
            </div>

            <div class="input-group">
            <label for="password">Password</label>
            <input type="text" id="password" name="password" placeholder="Enter password" required>
            </div>

            <div class="remember-me">
            <input type="checkbox" id="remember" name="remember">
            <label for="remember">Remember Me</label>
            </div>

            <button type="submit" class="login-btn">Log In</button>
        </form>
    </div>
    </div>
</body>
</html>