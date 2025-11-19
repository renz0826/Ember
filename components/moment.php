<?php

function renderMoment($moment_number, $moment_seal_date, $moment_seal_open, $moment_status)
{
    echo "<div class = \"moment_container\">
        <div class = \" moment_top\">
            <h4> $moment_status Moment #$moment_number </h4>
            <div class = \"actions\">
                <a href=\"edit_moment.php\" class = \"action\">
                    <img src = \"/Ember/assets/icons/icon-edit.svg\" />
                    <p> Edit </p>
                </a>
                <button class = \"action\">
                    <img src = \"/Ember/assets/icons/icon-delete.svg\" />
                    <p> Delete </p>
                </button>
            </div>
        </div>

        <div class = \"moment_bottom\">
            <img class=\"\" id=\"thumbnail\" src=\"blank\" />
            <div class=\"info\">
                <div class =\"seal_info\">
                    <p class =\"info_title\"> Sealed On </p>
                    <p class =\"info_main\"> $moment_seal_date </p>
                </div>
                <div class =\"seal_info\">
                    <p class =\"info_title\"> Seal Breaks On </p>
                    <p class =\"info_main\"> $moment_seal_open </p>
                </div>
                <div class =\"seal_info\">
                    <p class =\"info_title\"> Status </p>
                    <p class =\"moment_status\"> $moment_status </p>
                </div>
            </div>
        </div>
    </div>";
}

function renderRecentMoment($moment_number, $moment_seal_date, $moment_seal_open, $moment_status)
{
    echo "<div class = \"recent_moment_container\">
        <div class = \" moment_top\">
            <h5> $moment_status Moment #$moment_number </h5>
        </div>

        <div class = \"recent_moment_bottom\">
            <img class=\"\" id=\"thumbnail\" src=\"blank\" />
            <div class=\"info\">
                <div class =\"seal_info\">
                    <small class =\"info_title\"> Sealed On </small>
                    <small class =\"info_main\"> $moment_seal_date </small>
                </div>
                <div class =\"seal_info\">
                    <small class =\"info_title\"> Seal Breaks On </small>
                    <small class =\"info_main\"> $moment_seal_open </small>
                </div>
                <div class =\"seal_info\">
                    <small class =\"info_title\"> Status </small>
                    <small class =\"moment_status\"> $moment_status </small>
                </div>
            </div>
        </div>
    </div>";
}

function renderRecentlySealed()
{
    echo "<div class=\"recently_sealed\">
            <h3> Recently Sealed </h3>";
    
    renderRecentMoment("1", "2", "3", "Sealed");

    echo "</div>";
}
