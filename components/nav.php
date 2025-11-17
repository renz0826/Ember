<?php


// Nav bar
require_once __DIR__ . '/../includes/head.php';

$current = basename($_SERVER['PHP_SELF']);

$map = [
  'home.php' => 'Home',
  'preserve_moment.php' => 'Preserve a Moment',
  'my_moments.php' => 'My Moments',
  'edit_moment.php' => 'Edit Your Moment',
  'view_moment.php' => 'Moments Last'
];

$currentTitle = $map[$current] ?? null;

?>

<!DOCTYPE html>
<html lang="en"
  data-title="<?= htmlspecialchars($currentTitle ?? '') ?>">

<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/Ember/assets/css/components.css" />
</head>

<body>
  <nav class="site-nav" aria-label="Main navigation">
    <img class="logo" width="92px" src="/Ember/assets/images/logo-typo.png" alt="logo-typo">
    <ul>
      <li><a href="home.php" id="homeBtn"
          class="<?=  $current === 'home.php' ? 'active' : ' ' ?>">
          <img width="32px" height="32px" src="/Ember/assets/icons/icon-home.svg" alt="icon-home">
          Home
        </a>
      </li>
      <li><a href="preserve_moment.php" id="preserveBtn"
          class="<?=  $current === 'preserve_moment.php' ? 'active' : ' ' ?>">
          <img width="32px" height="32px" src="/Ember/assets/icons/icon-preserve.svg" alt="icon-preserve-moment">
          Preserve a Moment
        </a>
      </li>
      <li><a href="my_moments.php" id="momentsBtn"
          class="<?=  $current === 'my_moments.php' ? 'active' : ' ' ?>">
          <img width="32px" height="32px" src="/Ember/assets/icons/icon-moments.svg" alt="icon-moments">
          My Moments
        </a>
      </li>
      <li><a href="view_moment.php">View Moments</a></li>
      <li><a href="edit_moment.php">Edit Moment</a></li>
      <li class="logout"><a href="/Ember/index.php">
          <img width="32px" height="32px" src="/Ember/assets/icons/icon-logout.svg" alt="icon-logout">
          Logout
        </a>
      </li>
    </ul>
  </nav>
</body>

</html>