<?php

require_once __DIR__ . '/../includes/head.php';

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="/Ember/assets/css/calendar.css">
    <script src="/Ember/assets/js/calendar.js" defer></script>
</head>
    <div id="calendar">
        <h2 id="setDate"></h2>
        <div class="calendar_header">

            <h4 id="month_year"></h4>
            <div class="calendar_navigation">
                <button id="prev"> <img src="/Ember/assets/icons/icon-arrow.svg" alt="icon-arrow" /> </button>
                <button id="next"> <img style="rotate: 180deg; " src="/Ember/assets/icons/icon-arrow.svg"
                        alt="icon-arrow" /> </button>
            </div>
        </div>
        <div class="main_calendar">
            <div class="calendar_week"></div>
            <div class="calendar_grid"></div>
        </div>
    </div>
</html>