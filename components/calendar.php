<?php

// Renders the calendar component structure, designed to be initialized by JavaScript
function renderCalendar($initialDate = '')
{
    // Prepare the value attribute string for the endDate hidden input
    $valAttr = $initialDate ? "value='" . htmlspecialchars($initialDate, ENT_QUOTES) . "'" : "";

    // Output using Heredoc syntax
    echo <<<HTML
<div id="calendar">
    <h2 id="setDate"></h2>

    <!-- Hidden input for startDate and endDate-->
    <input type="hidden" id="startDate" name="startDate">
    <input type="hidden" id="endDate" name="endDate" $valAttr>

    <!-- Structure for the month, year, and calendar navigation -->
    <div class="calendar_header">
        <h4 id="month_year"></h4>
        <div class="calendar_navigation">
            <button type="button" id="prev">
                <img 
                    src="/Ember/assets/icons/icon-arrow.svg" 
                    alt="Previous month arrow icon" 
                />
            </button>
            <button type="button" id="next">
                <img 
                    style="rotate: 180deg;" 
                    src="/Ember/assets/icons/icon-arrow.svg" 
                    alt="Next month arrow icon" 
                />
            </button>
        </div>
    </div>
    
    <!-- Structure for the weeks and days -->
    <div class="main_calendar">
        <div class="calendar_week"></div>
        <div class="calendar_grid"></div>
    </div>
</div>

<!-- Important external files for calendar functionality -->
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://accounts.google.com/gsi/client"></script>

<script src="/Ember/assets/js/calendar.js" defer></script>
<link rel="stylesheet" href="/Ember/assets/css/calendar.css">
HTML;
}
