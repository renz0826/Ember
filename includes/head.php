<?php

// Database connection
require_once __DIR__ . '/../includes/db_connect.php';

// Renders <header> tag for necessary external files
echo <<<HTML
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="icon" href="/Ember/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="/Ember/assets/css/global.css">
  <link rel="stylesheet" href="/Ember/assets/css/pages.css">
  <script src="/Ember/assets/js/script.js" defer></script>
</head>
HTML;
