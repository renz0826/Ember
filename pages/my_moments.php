<?php

// includes the head
require_once __DIR__ . '/../includes/head.php';

// includes components
require_once __DIR__ .'/../components/button.php';
require_once __DIR__ . '/../components/calendar.php';
require_once __DIR__ . '/../components/moment.php'; 
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Moments - Ember</title>
</head>

<body>
    <main>
        <div class="left">
            <?php require_once __DIR__ . '/../components/nav.php';?>

        </div>
        <div class="right">
            <div class="top">
                <?php require_once __DIR__ . '/../components/header.php'; ?>
            </div>  
            <div class="bottom">
                <div class="bottom_left">
                    <div class="moment_top">
                        <h3> Soon to Unseal</h3>
                        <div class="actions">
                            <?= renderSortButton('Sealed', 'javascript:void(0)', 'button_small', 'filter-sealed'); ?>
                            <?= renderSortButton('Unsealed', 'javascript:void(0)', 'button_no_fill_small', 'filter-unsealed'); ?>
                        </div>
                    </div>

                    <div id="moments-list">
                        <?php renderMoment('5', 'Sept 29, 2025', 'Jan 17, 2026', 'Sealed'); ?>
                        <?php renderMoment('4', 'Aug 26, 2025', 'Feb 14, 2026', 'Sealed'); ?>
                        <?php renderMoment('3', 'July 18, 2025', 'Jan 17, 2026', 'Sealed'); ?>
                        <?php renderMoment('2', 'July 02, 2025', 'Mar 26, 2026', 'Sealed'); ?>

                        <?php renderMoment('1', 'Jan 01, 2024', 'Nov 25, 2025', 'Unsealed'); ?>
                    </div>
                </div>
                
                <div class="bottom_right">
                    <?php renderCalendar(); ?>
                    
                    <div style="margin-bottom: 24px;">
                        <?php renderLinkButton('Preserve a Moment', 'preserve_moment.php', 'button', '', '/Ember/assets/icons/icon-preserve-white.svg'); ?>
                    </div>
                    
                    <?php renderRecentlySealed(); ?>
                </div>

            </div>
        </div>

    </main>
</body>

</html>