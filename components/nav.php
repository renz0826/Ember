<?php

// Get the current script filename (e.g., 'home.php')
$current = basename($_SERVER['PHP_SELF']);

// Defualt static map used to map script filenames.
$map = [
    'home.php' => 'Home',
    'preserve_moment.php' => 'Preserve a Moment',
    'my_moments.php' => 'My Moments',
    'edit_moment.php' => 'Edit Your Moment'
];

// Determines page title
if (isset($pageTitleOverride)) {
    // Use a dynamic title set by the specific page
    $currentTitle = $pageTitleOverride;
} else {
    // Use the static map based on the current filename
    $currentTitle = $map[$current] ?? 'Ember'; // Fallback to 'Ember' if filename is unknown
}

// Ensure no extra spaces
$currentTitle = trim($currentTitle);

// Include common head elements
require_once __DIR__ . '/../includes/head.php';
?>

<!DOCTYPE html>

<!-- <html> tag reflecting the current page title and page description -->
<html 
    lang="en" 
    data-title="<?= htmlspecialchars($currentTitle ?? '') ?>"   
    data-description="<?= htmlspecialchars($pageDescriptionOverride ?? '') ?>"
>

<body>

    <!-- Renders the nav bar -->
    <nav class="site-nav" aria-label="Main navigation">
        <img 
            class="logo" 
            width="92px" 
            src="/Ember/assets/images/logo-typo.png" 
            alt="Ember Logo Typographic"
        >

        <!-- Nav Link -->
        <ul>
            <li>
                <a href="home.php" id="homeBtn"
                    class="<?= $current === 'home.php' ? 'active' : '' ?>">   <!-- Dynamic class that highlights when clicked -->
                    <img width="32px" height="32px" src="/Ember/assets/icons/icon-home.svg" alt="Home icon">
                    Home
                </a>
            </li>
            
            <li>
                <a href="preserve_moment.php" id="preserveBtn"
                    class="<?= $current === 'preserve_moment.php' ? 'active' : '' ?>">
                    <img width="32px" height="32px" src="/Ember/assets/icons/icon-preserve.svg" alt="Preserve a Moment icon">
                    Preserve a Moment
                </a>
            </li>
            
            <li>
                <a href="my_moments.php" id="momentsBtn"
                    class="<?= $current === 'my_moments.php' ? 'active' : '' ?>">
                    <img width="32px" height="32px" src="/Ember/assets/icons/icon-moments.svg" alt="My Moments icon">
                    My Moments
                </a>
            </li>
            
            <li class="logout">
                <a href="/Ember/index.php">
                    <img width="32px" height="32px" src="/Ember/assets/icons/icon-logout.svg" alt="Logout icon">
                    Logout
                </a>
            </li>
        </ul>
    </nav>
</body>
</html>