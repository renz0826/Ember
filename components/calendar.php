<?php
// Accept an optional parameter for the existing date
function renderCalendar($initialDate = '')
{
    // Prepare the value attribute string for the hidden input
    $valAttr = $initialDate ? "value='" . htmlspecialchars($initialDate, ENT_QUOTES) . "'" : "";

    echo <<<HTML
<div id="calendar">
    <h2 id="setDate"></h2>

    <input type="hidden" id="startDate" name="startDate">
    <input type="hidden" id="endDate" name="endDate" $valAttr>

    <div class="calendar_header">
        <h4 id="month_year"></h4>
        <div class="calendar_navigation">
            <button type="button" id="prev">
                <img src="/Ember/assets/icons/icon-arrow.svg" alt="icon-arrow" />
            </button>
            <button type="button" id="next">
                <img style="rotate: 180deg;" src="/Ember/assets/icons/icon-arrow.svg" alt="icon-arrow" />
            </button>
        </div>
    </div>
    <div class="main_calendar">
        <div class="calendar_week"></div>
        <div class="calendar_grid"></div>
    </div>
</div>

<script src="/Ember/assets/js/calendar.js" defer></script>
<link rel="stylesheet" href="/Ember/assets/css/calendar.css">
HTML;
}
